// initial data
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// const p = new Product({
//     name: 'Apple',
//     price: 128,
//     category: 'fruit'
// });

// p.save()
//     .then(() => {
//         console.log('Product saved');
//         // mongoose.connection.close();
//     })
//     .catch(err => {
//         console.log(err);
//         // mongoose.connection.close();
//     });

Product.insertMany([
    {
        name: 'Apple',
        price: 128,
        category: 'fruit'
    },
    {
        name: 'Banana',
        price: 98,
        category: 'fruit'
    },
    {
        name: 'Carrot',
        price: 78,
        category: 'vegetable'
    },
    {
        name: 'Milk',
        price: 168,
        category: 'dairy'
    }
])
    .then(() => {
        console.log('Products inserted');
        mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
        mongoose.connection.close();
    });
