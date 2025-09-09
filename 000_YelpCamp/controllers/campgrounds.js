const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const grounds = await Campground.find();
    res.render('campgrounds/index', { grounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.renderEditForm = async (req, res) => {
    const ground = await Campground.findById(req.params.id);
    if (!ground) {
        req.flash('error', 'キャンプ場が見つかりません');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { ground });
}

module.exports.showCampground = async (req, res) => {
    const ground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            select: 'username'
        }
    }).populate('author');
    if (!ground) {
        req.flash('error', 'キャンプ場が見つかりません');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { ground });
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    // 投稿者の情報をDBに保存
    campground.author = req.user._id;
    result = await campground.save();
    // console.log(result);
    req.flash('success', 'キャンプ場を作成しました');
    res.redirect(`/campgrounds/${result._id}`);
}

module.exports.updateCampground = async (req, res) => {
    // ejs の form の name 属性で name=campground[title] のように指定中のため、req.body.campground でアクセス可能
    // そうしない場合、title: req.body.title のようにアクセスする必要がある
    // Postman 等からの API コールから保護したい
    // 更新前に、リクエスト送信者と投稿の投稿者が同じかどうかをチェックするため、FindしてからUpdateをする
    const { title, price, location, description } = req.body.campground;
    const campground = await Campground.findById(req.params.id);
    console.log(campground);
    console.log(req.body);
    campground.title = title;
    campground.location = location;
    campground.price = price;
    campground.description = description;
    // 画像削除チェック
    if (req.body.deleteImage === 'on') {
        campground.image = '';
    }

    // 新しい画像がアップロードされていれば更新（multer等でreq.fileがセットされる）
    if (req.file) {
        // 本来は、更新前の画像を upload フォルダから削除する処理を入れる
        
        // Windows環境だと req.file.path のパス区切りが \ になるため、/ になるように処理しておく
        campground.image = '/uploads/' + req.file.filename;
    } else if (image) {
        // 画像フィールドがフォームで送信されていれば（既存画像のまま）
        campground.image = image;
    }
    // result = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true, runValidators: true });
    result = await campground.save();
    console.log(result);

    req.flash('success', 'キャンプ場を更新しました');
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const result = await Campground.findByIdAndDelete(req.params.id);
    console.log(result);
    if (result.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: result.reviews } });
    }
    req.flash('success', 'キャンプ場を削除しました');
    res.redirect('/campgrounds');
}