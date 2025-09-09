const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// バリデーション用のミドルウェア
const validateCampground = (req, res, next) => {
    if(req.file) req.body.campground.image = '/uploads/' + req.file.filename;
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

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'あなたに権限がありません');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};

// 同一のルートに対して、異なるHTTPメソッドを使う場合、router.route()を使うと見通しが良くなる
router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground));
    .post(upload.single('image'), validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// router.get('/:id', catchAsync(campgrounds.showCampground));

// router.get('/', catchAsync(campgrounds.index));

// router.post('/', validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground));

module.exports = router;