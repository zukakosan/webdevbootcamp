const joi = require('joi');

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        image: joi.string().optional().allow(''),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().min(0).required()
    }).required(),
    deleteImage: joi.string().optional().allow('')
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().allow('').optional(),
        rating: joi.number().min(1).max(5).required()
    }).required()
})