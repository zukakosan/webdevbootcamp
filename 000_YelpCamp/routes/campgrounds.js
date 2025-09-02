const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema } = require('../schemas');

// バリデーション用のミドルウェア
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        // catchAsync で try-catch するため、エラーを throw をするだけで、catchAsync の catch 節に飛ぶ
        // つまり、next() を呼ぶ必要はない
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id/edit', catchAsync(async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    if (!ground) {
        req.flash('error', 'キャンプ場が見つかりません');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { ground });
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const result = await Campground.findByIdAndDelete(req.params.id);
    console.log(result);
    if(result.reviews.length>0){
        await Review.deleteMany({_id:{$in:result.reviews}});
    }
    req.flash('success', 'キャンプ場を削除しました');
    res.redirect('/campgrounds');
}));

router.put('/:id',validateCampground, catchAsync(async (req, res) => {
    // ejs の form の name 属性で name=campground[title] のように指定中のため、req.body.campground でアクセス可能
    // そうしない場合、title: req.body.title のようにアクセスする必要がある
    result = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
    console.log(result);
    req.flash('success', 'キャンプ場を更新しました');
    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const ground = await Campground.findById(req.params.id).populate('reviews');
    if (!ground) {
        req.flash('error', 'キャンプ場が見つかりません');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { ground });
}));

router.get('/', catchAsync(async (req, res) => {
    const grounds = await Campground.find();
    res.render('campgrounds/index', { grounds });
}));

router.post('/', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    result = await campground.save();
    // console.log(result);
    req.flash('success', 'キャンプ場を作成しました');
    res.redirect(`/campgrounds/${result._id}`);
})
);

module.exports = router;