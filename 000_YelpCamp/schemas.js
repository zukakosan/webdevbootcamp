const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        image: joi.string().optional().allow(''),
        description: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        price: joi.number().min(0).required()
    }).required(),
    deleteImage: joi.string().optional().allow('')
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().allow('').optional().escapeHTML(),
        rating: joi.number().min(1).max(5).required()
    }).required()
})