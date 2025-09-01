const express = require('express');
const app = express();
const session = require('express-session');
// const { use } = require('react');

// 一度だけユーザにメッセージを表示するためのミドルウェア
// 表示した後に更新すると消える
const flash = require('connect-flash');

app.use(flash());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.message = req.flash('info');
    next();
});


app.get('/viewcount', (req, res) => {
    if (req.session.count) { req.session.count += 1; }
    else { req.session.count = 1; }
    res.send(`あなたは${req.session.count}回このページを訪問しました`);
});

app.get('/register', (req, res) => {
    const { username = 'anonymous' } = req.query;
    req.session.username = username;
    req.flash('info', '登録が完了しました');
    res.redirect('/greet');
});

app.get('/greet', (req, res) => {
    // username は register で必ず保存されるため、こちらで規定値は入れない
    const { username } = req.session;
    res.send(`Welcome ${username} san!`);
    
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});