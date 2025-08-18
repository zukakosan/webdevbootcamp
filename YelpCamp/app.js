const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
// export されたモデルをインポート
const Campground = require('./models/campground');
const { render } = require('ejs');
// connect to mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { ground });
});

app.put('/campgrounds/:id', async (req, res) => {
    result = await Campground.findByIdAndUpdate(req.params.id, req.body.campground,{new: true, runValidators: true});
    console.log(result);
    res.redirect(`/campgrounds/${req.params.id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { ground });
});

app.get('/campgrounds', async (req,res) => {
    const grounds = await Campground.find();
    res.render('campgrounds/index', {grounds});
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    result = await campground.save();
    console.log(result);
    res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});