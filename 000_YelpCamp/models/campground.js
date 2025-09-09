const mongoose = require('mongoose');
const Review = require('./review');
const { ref, required } = require('joi');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: {
    type: String,
    required: [true, 'タイトルは必須です']
  },
  image: {
    type: String,
    required: false
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
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// post は POST メソッドではなく、mongoose のミドルウェアの一種
// 設定した関数の post(実行後)に実行するミドルウェアの定義
// campgroundSchema.pre('findOneAndDelete', async function(doc) {
//   console.log()
//   if (doc && doc.reviews && doc.reviews.length) {
//     try {
//       const res = await Review.deleteMany({ _id: { $in: doc.reviews } });
//       console.log('Review.deleteMany result:', res);
//       console.log('DeletedCount:', res.deletedCount);
//     } catch (err) {
//       console.error('Error deleting reviews:', err);
//     }
//   }
// });

// 以下のモデルを作成すると、campgrounds コレクションが自動的に作成されます。
// module.exports によって、他のファイルからこのモデルをインポートできるようになります。
module.exports = mongoose.model('Campground', campgroundSchema);