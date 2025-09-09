// node.js で web app を作成するための実績のあるフレームワークが express
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const morgan = require('morgan');
// export されたモデルをインポート
const { render } = require('ejs');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const AppError = require('./apperror');
const expressSession = require('express-session');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');

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

// app は express のインスタンス
// その app を使って middleware
// middleware は、express の上に成り立つ仕組み
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// uploads/xxxxxxx というパスでアクセスできるように公開する
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.engine('ejs', ejsMate);

// app.use() の内容は、リクエストが来るたびに毎回実行される
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
// ログ用ミドルウェア
app.use(morgan('dev'));

const sessionConfig = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        maxAge: 1000*60*60*24*7
    }
};
app.use(expressSession(sessionConfig));
app.use(flash());

// passport は express-session の後に宣言する必要がある
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// ユーザ情報をどうやってセッションに出し入れするか
// serializeUser を指定することで、ID 情報をセッションに保存する
// deserializeUser で、セッションから ID を取り出して、ユーザ情報を復元する
// これらのメソッドは、passport-local-mongoose が User モデルに追加してくれる
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ルートのマウントはミドルウェアの後で行う
// mount routes after session/flash and res.locals are configured
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.use((req, res, next) => {
    console.log(req.method, req.path);
    // console.log('hello middleware');
    // すべてのメソッドを GET に変換する処理なんかも書ける
    // （安全のためにルートのないメソッドをGET にしたいときとかに使える？）
    // req.method = 'GET'
    // ミドルウェアの処理内容は、ルートハンドラより前に実行されるため、リクエストの内容を編集してしまえば、それがルートハンドラに渡される

    // middleware の終わりを明確にするため、明示的に return を next() に対して記述
    return next();
});
// パスワードチェック用のミドルウェア
// 以下の定義だと、/secret/* に対してパスワードチェックがかかってしまうので、ルートハンドラ側に組み込む
// app.use('/secret',(req, res, next) => {
//     if (req.query.password === 'secret') {
//         return next();
//     }
//     return res.status(403).render('login');
// });

const passwdCheck = (req, res, next) => {
    if (req.query.password === 'secret') {
        return next();
    }
    throw new AppError('パスワードが間違っています。', 401);
};


// パスを指定したミドルウェア宣言
// 認証チェックをかけるとか
app.use('/campgrounds', (req, res, next) => {
    console.log('Request made to /campgrounds');
    next();
});


app.get('/sampleuserregister', async(req,res)=>{
    const user = new User({username:'moge', email:'moge@example.com'});
    // 自動的に password を hash 化して作ってくれる -> それを mongo へ投げればいい
    // ここでは、Pbkdf2 で hash 化してくれている
    const registeredUser = await User.register(user, 'password');
    res.send(registeredUser);
});

// app に対してルーティングを設定
app.get('/', (req, res) => {
    res.render('home');
});

// passwdCheck ミドルウェアの next() は、ルートハンドラの Callback に繋がる
app.get('/secret', passwdCheck, (req, res) => {
    console.log('You found the secret!');
    res.render('secret');
});

// res を使わなくても、引数として指定する -> next が第3引数であるため、位置がずれてしまう
app.get('/admin', (req, res, next) => {
    if (req.query.role === "admin") {
        return next();
    }
    throw new AppError('Permission Error', 403);
}, (req, res) => {
    console.log('admin page');
    res.send('admin page');
});

app.get('/moge', (req, res) => {
    moge();
});

// app.xxx がすべて終わった後に 404 用のミドルウェアを宣言
// すべてのルートにマッチしなかった場合に実行される
// Express では、NotFound はエラーとして扱われないため、最後に 404 用のルートハンドラを用意
app.use((req, res, next) => {
    // status() で Status Code を設定できる
    // エラーページ用のテンプレートを指定して、render() で表示
    // Application Gateway とかで 404 ページを指定するときもこんなイメージなのかも
    next(new ExpressError('ページが見つかりません', 404));
});

// error 処理は、app.use, ルートハンドラの後に宣言する必要がある
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('errors/500');
//     next(err);
// });



// ルートハンドラやミドルウェアで Error が発生したときに、app.use(err, req, res, next)、つまりエラーハンドラが呼ばれる
// err, req, res, next の4つの引数を渡してあげると、Expressはそれをエラーハンドラとして認識する
app.use((err, req, res, next) => {
    // default を 500 にしておく
    const { status = 500, message = 'Something wrong has happened' } = err;
    res.status(status).render('error', { err });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});