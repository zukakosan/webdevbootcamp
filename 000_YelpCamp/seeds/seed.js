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
            author:'68bb8881af381190249de709',
            location: `${cities[randomIndex].prefecture},${cities[randomIndex].city}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: Math.floor(Math.random() * 20) + 1000,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        });
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
});

