const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
// connect to mongoose
mongoose.connect('mongodb://localhost:27017/authDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/error', (req, res) => {
    res.render('error');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // findById が使えないため findOne を使用
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        res.cookie('authenticity', true); // Set a cookie
        res.redirect('/secret');
    } else {
        res.redirect('/error');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect('/login');
})

app.get('/secret', (req, res) => {
    console.log(req.cookies);
    if (req.cookies && req.cookies.authenticity) {
        res.send("This is the secret page!");
    } else {
        res.redirect('/error');
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
