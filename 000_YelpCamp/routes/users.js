const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

router.use(express.urlencoded({ extended: true }));

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username: username, email: email });
        // 自動的に password を hash 化して作ってくれる -> それを mongo へ投げればいい
        // ここでは、Pbkdf2 で hash 化してくれている
        const registeredUser = await User.register(user, password);
        result = await registeredUser.save();
        req.flash('success', 'Welcome to YelpCamp!');
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        console.error(e);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

// passport.authenticate() ミドルウェアを使ってログイン処理
// 自動的に username と password を req.body から探してくれる
router.post('/login', storeReturnTo, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // ログアウト後の処理（例: リダイレクト）
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
});

module.exports = router;