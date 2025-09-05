const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Database connection error:', err);
});

// スキーマの制約はここに入れる
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  onSale: { type: Boolean, default: false }
});

productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true });
};

productSchema.methods.showName = function () {
  console.log(`Product Name: ${this.name}`);
  return this.name;
};

productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);
// const sample = new Product({
//   name: 'あああ',
//   price: 19.99,
//   category: 'Electronics',
//   onSale: false
// });

// sample.save()
// .then(m => console.log('Product saved:', m))
// .catch(err => console.error('Error saving product:', err));

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: 'あああ' });
    console.log(foundProduct);
    // インスタンスメソッドは、インスタンスに紐づく
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
}

// findProduct();
// Static Method は、Product というクラスに紐づく
Product.fireSale()
  .then(result => console.log('Fire sale applied:', result))
  .catch(err => console.error('Error applying fire sale:', err));
