const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  price: Number
});

// 以下のモデルを作成すると、campgrounds コレクションが自動的に作成されます。
// module.exports によって、他のファイルからこのモデルをインポートできるようになります。
module.exports = mongoose.model('Campground', campgroundSchema);