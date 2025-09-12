const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../controllers/users');

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }).then(() => {
//     console.log('MongoDB connected');
// }).catch(err => {
//     console.error('MongoDB connection error:', err);
// });

router.use(express.urlencoded({ extended: true }));

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), users.redirectAfterLogin);
    
router.get('/logout', users.renderLogout);


// router.get('/register', users.renderRegisterForm);

// router.post('/register', users.registerUser);

// router.get('/login', users.renderLoginForm);

// // passport.authenticate() ミドルウェアを使ってログイン処理
// // 自動的に username と password を req.body から探してくれる
// router.post('/login', storeReturnTo, passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true
// }), users.redirectAfterLogin);


module.exports = router;