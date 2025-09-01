const express = require('express');
const app = express();
const shelterRoutes = require('./routes/shelters');
const dogRoutes = require('./routes/dogs');
const adminRoutes = require('./routes/admin');
const cookieParser = require('cookie-parser');
// ここに定義されるミドルウェアは、すべてのルートに適用される（されてしまう（既定の動作））
app.use(cookieParser('mysecret'));
app.use('/shelters', shelterRoutes);
app.use('/dogs', dogRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    const {name = 'anonymous'} = req.cookies;
    res.send(`Hello ${name}`);
});

app.get('/getsignedcookie',(req, res) => {
    res.cookie('fruit', 'apple', { signed: true });
    res.send('Signed cookie set');
});

app.get('/verifyfruit', (req, res) => {
    const { signedCookies } = req;
    if (signedCookies.fruit) {
        res.send(`Verified signed cookie: ${signedCookies.fruit}`);
    } else {
        res.send('No signed cookie found');
    }
});

app.get('/setname', (req, res) => {
  const newName = req.query.name;
  // ここで新しい名前を設定するロジックを追加
  if (newName) {
    res.cookie('name', newName);
  }
  res.send(`Cookie Page`);
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});