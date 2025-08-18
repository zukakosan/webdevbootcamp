const mongoose = require('mongoose');
const Campground = require('../models/campground'); // スキーマ（モデル）をインポート


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

Campground.insertMany([{
  title: 'My Backyard',
  image: 'https://source.unsplash.com/collection/483251',
  description: 'This is my backyard',
  location: 'My House'
},
{
  title: 'My Beach House',
  image: 'https://source.unsplash.com/collection/483251',
  description: 'This is my beach house',
  location: 'California'
}
]);