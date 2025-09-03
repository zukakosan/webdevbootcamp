const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
// connect to mongoose
mongoose.connect('mongodb://localhost:27017/authDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user_id) {
        next();
    } else {
        return res.redirect('/login');
    }
};

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    const error = req.flash('error')[0]; // 存在しなければ undefined
    res.render('login', { error });
});

app.post('/logout',(req,res)=>{
    // req.session.user_id = null;
    req.session.destroy();
    res.redirect('/login');
});

app.get('/error', (req, res) => {
    res.render('error');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // findById が使えないため findOne を使用
    // const user = await User.findOne({ username });
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        // ログイン状態とユーザIDを同時に管理するために user._id をセッションに保存
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password});
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/secret');
})

app.get('/secret', requireLogin, (req, res) => {
    console.log(req.session);
    res.render("secret", { user: req.session.user_id });
});

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('top secret!!!!!');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
