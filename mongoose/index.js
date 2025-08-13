const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Database connection error:', err);
});

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});
// 

const Movie = mongoose.model('Movie', movieSchema);
const kimetsu = new Movie({
    title: 'Kimetsu no Yaiba',
    year: 2020,
    score: 9.5,
    rating: 'R'
});

// Movie.insertMany([kimetsu])
// .then(data =>{
//     console.log('data',data);
// })
// .catch(err => {
//     console.log('err',err);
// });

// const blogSchema = new mongoose.Schema({
//     title: String,
//     year: Number,
//     date: Date,
//     text: String
// });
// const Blog = mongoose.model('Blog', blogSchema);
// const blog1 = new Blog({
//     title: 'aaaaa',
//     year: 2020,
//     date: new Date(),
//     text: 'This is a blog post about aaaaa.'
// });