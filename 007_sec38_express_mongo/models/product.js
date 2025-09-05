const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['vegetable', 'fruit', 'dairy']
    }
});

// 大文字の Product というモデルを定義すると、MongoDB の products コレクションが作られる
module.exports = mongoose.model('Product', productSchema);