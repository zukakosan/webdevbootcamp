const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');

// connect to mongo db
mongoose.connect('mongodb://127.0.0.1:27017/farmStand', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// app path is based on the current directory
app.set('views', path.join(__dirname, 'views'));
// use ejs as view engine
app.set('view engine', 'ejs');
// parse request body
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// クエリパラメータの _method をもとに、HTTP メソッドを上書きするためのミドルウェア
app.use(methodOverride('_method'));


const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products/new', (req, res) => {
  res.render('products/new', { categories });
});

app.post('/products', async (req, res) => {
  console.log(req.body);
  const p = new Product({ name: req.body.name, price: req.body.price, category: req.body.category });
  // redirect は GET リクエストに変わるため、ページの更新に対しても適切に動作します。
  await p.save()
    .then(() => res.redirect(`/products/${p._id}`))
    .catch(err => console.log(err));
});

app.get('/products/:id/edit', async (req, res) => {
  // req.params から id のみ取得
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product, categories });
});

app.put('/products/:id', async (req, res) => {
  console.log(req.body);
  // runValidators: true を指定することで、データ更新時にも schema のバリデーションを実行
  // new: true を指定することで、更新後のドキュメントを返す
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
  console.log(product);
  res.redirect(`/products/show`);
  // Product.updateOne({},{})
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/show', { product });
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(req.params.id);
  console.log(`${id} was deleted`);
  res.redirect('/products');
});


app.get('/products', async (req, res) => {
  // 時間がかかる処理なので、async/awaitを使う
  const { category } = req.query;
  if(category){
    const products = await Product.find({ category });
    res.render('products/index', { products, categories, category });
  }else{
    const products = await Product.find({});
    res.render('products/index', { products, categories, category });
  }
  // console.log(products);
});

// app.get('/dog',(req, res)=>{
//   res.render('dog.ejs');
// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});