const express = require('express');
const router = express.Router({mergeParams: true});
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');
const reviews = require('../controllers/reviews');

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

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'あなたに権限がありません');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

module.exports = router;