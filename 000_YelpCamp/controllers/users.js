const User = require('../models/user');

module.exports.registerUser = async (req, res) => {
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
}
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.renderLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // ログアウト後の処理（例: リダイレクト）
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
}

module.exports.redirectAfterLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}