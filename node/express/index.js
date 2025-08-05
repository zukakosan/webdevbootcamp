const path = require('path');
const express = require('express');
const app = express();

// 任意の Port で受け付ける
// app.use((req, res) =>{
//     console.log('Middleware is running');
//     res.send({"message": "Hello, World!"});
// });

// 既定だと node の実行 process.cwd() が基準になってしまうため、絶対パスに書き換える
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/home', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('home.ejs', { num });
    console.log('GET request to /cats');
});

app.get('/cats', (req, res) => {
    const cats = ['tama','momo','kiki'];
    res.render('cats.ejs', { cats });
});

app.get('/dogs', (req, res) => {
    res.send('/dogs PAGE!!!');
    console.log('GET request to /dogs');
});

app.get('/', (req, res) => {
    res.send('<h1>HOME</h1>');
    console.log('GET request to /');
});

app.get('/search', (req, res) => {
    const { q } = req.query;
    res.send(`<h1>${q} Results</h1>`);
    console.log('GET request to /search with query:', req.query);
});

app.get('/r/:subpage', (req, res) => {
    // res.send('<h1>subpage</h1>');
    res.render('subpage.ejs',{ subpage: req.params.subpage });
    console.log(`GET request to /r/${req.params.subpage}`);
});

app.get('/r/:subpage/:id', (req, res) => {
    res.send(`<h1>subpage</h1> ${req.params.subpage} ${req.params.id}`);
    console.log(`GET request to /r/${req.params.subpage}`);
});

app.get(/(.*)/, (req, res) => {
    res.send('そんなパスシラン');
    console.log('GET at *');
});

app.listen(80, () => {
    console.log('Server is running on port 80');
});