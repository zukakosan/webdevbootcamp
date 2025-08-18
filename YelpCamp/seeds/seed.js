const mongoose = require('mongoose');
const Campground = require('../models/campground'); // スキーマ（モデル）をインポート
const cities = require('./cities'); // cities データをインポート
const { descriptors, places } = require('./seedHelpers'); // seedHelpers データをインポート
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const camp = new Campground({
            location: `${cities[randomIndex].prefecture},${cities[randomIndex].city}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
});

