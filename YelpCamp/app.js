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
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const Campground = require('./models/campground');
const Review = require('./models/review');

const { campgroundSchema, reviewSchema } = require('./schemas');

const AppError = require('./apperror');

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

// バリデーション用のミドルウェア
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        // catchAsync で try-catch するため、エラーを throw をするだけで、catchAsync の catch 節に飛ぶ
        // つまり、next() を呼ぶ必要はない
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
// app は express のインスタンス
// その app を使って middleware
// middleware は、express の上に成り立つ仕組み
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

// app.use() の内容は、リクエストが来るたびに毎回実行される
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
// ログ用ミドルウェア
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
    throw new AppError('パスワードが間違っています。', 401);
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

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { ground });
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const result = await Campground.findByIdAndDelete(req.params.id);
    console.log(result);
    if(result.reviews.length>0){
        await Review.deleteMany({_id:{$in:result.reviews}});
    }
    res.redirect('/campgrounds');
}));

app.put('/campgrounds/:id',validateCampground, catchAsync(async (req, res) => {
    // ejs の form の name 属性で name=campground[title] のように指定中のため、req.body.campground でアクセス可能
    // そうしない場合、title: req.body.title のようにアクセスする必要がある
    result = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
    console.log(result);
    res.redirect(`/campgrounds/${req.params.id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const ground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { ground });
}));

app.get('/campgrounds', catchAsync(async (req, res) => {
    const grounds = await Campground.find();
    res.render('campgrounds/index', { grounds });
}));

app.delete('/campgrounds/:campgroundId/reviews/:reviewId', catchAsync(async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    // $pull 
    await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
    res.redirect(`/campgrounds/${campgroundId}`);
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));


app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    result = await campground.save();
    // console.log(result);
    res.redirect('/campgrounds');
})
);

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