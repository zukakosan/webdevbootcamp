// node.js で web app を作成するための実績のあるフレームワークが express
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const morgan = require('morgan');
// export されたモデルをインポート
const Campground = require('./models/campground');
const { render } = require('ejs');
const ejsMate = require('ejs-mate');
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

app.engine('ejs', ejsMate);

// app.use() の内容は、リクエストが来るたびに毎回実行される
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(morgan('dev'));
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
    return res.status(403).render('login');
};


// パスを指定したミドルウェア宣言
// 認証チェックをかけるとか
app.use('/campgrounds', (req, res, next) => {
    console.log('Request made to /campgrounds');
    next();
});

// app に対してルーティングを設定
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

app.delete('/campgrounds/:id', async (req, res) => {
    const result = await Campground.findByIdAndDelete(req.params.id);
    console.log(result);
    res.redirect('/campgrounds');
});

app.put('/campgrounds/:id', async (req, res) => {
    // ejs の form の name 属性で name=campground[title] のように指定中のため、req.body.campground でアクセス可能
    // そうしない場合、title: req.body.title のようにアクセスする必要がある
    result = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
    console.log(result);
    res.redirect(`/campgrounds/${req.params.id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { ground });
});

app.get('/campgrounds', async (req, res) => {
    const grounds = await Campground.find();
    res.render('campgrounds/index', { grounds });
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    result = await campground.save();
    console.log(result);
    res.redirect('/campgrounds');
});

// passwdCheck ミドルウェアの next() は、ルートハンドラの Callback に繋がる
app.get('/secret', passwdCheck, (req, res) => {
    console.log('You found the secret!');
    res.render('secret');
});
// app.xxx がすべて終わった後に 404 用のミドルウェアを宣言
// すべてのルートにマッチしなかった場合に実行される
app.use((req, res) => {
    // status() で Status Code を設定できる
    // エラーページ用のテンプレートを指定して、render() で表示
    // Application Gateway とかで 404 ページを指定するときもこんなイメージなのかも
    res.status(404).render('errors/404');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});