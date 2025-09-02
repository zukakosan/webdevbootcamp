const express = require('express');
const router = express.Router({mergeParams: true});
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    // $pull 
    await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
    req.flash('success', 'レビューを削除しました');
    res.redirect(`/campgrounds/${campgroundId}`);
}));

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'レビューを投稿しました');
    res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports = router;