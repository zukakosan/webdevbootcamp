const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: {
    type: String,
    required: [true, 'タイトルは必須です']
  },
  image: {
    type: String,
    required: [true, '画像URLは必須です']
  },
  description: {
    type: String,
    required: [true, '説明は必須です']
  },
  location: { 
    type: String,
    required: [true, '場所は必須です']
  },
  price: {
    type: Number,
    required: [true, '価格は必須です'],
    min: [0, '価格は0以上である必要があります']
  }
});

// 以下のモデルを作成すると、campgrounds コレクションが自動的に作成されます。
// module.exports によって、他のファイルからこのモデルをインポートできるようになります。
module.exports = mongoose.model('Campground', campgroundSchema);