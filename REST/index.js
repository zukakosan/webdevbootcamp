const express = require('express');
const app = express();
const path = require('path');
const { v4: uuid } = require('uuid');
const methodOverride = require('method-override');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ejs を返せるようにする
app.set('view engine', 'ejs');
// ビューのディレクトリを設定
app.set('views', path.join(__dirname, 'views'));

let comments = [{
    id: uuid(),
    username: 'John Doe',
    comment: 'This is a sample comment.'

},{
    id: uuid(),
    username: 'Jane Smith',
    comment: 'This is another sample comment.'
},{
    id: uuid(),
    username: 'Alice Johnson',
    comment: 'This is yet another sample comment.'
}];

app.get('/comments/new', (req, res) => {
  res.render('comments/new');
});

app.get('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const comment = comments.find(c => c.id === commentId);
  res.render('comments/show', { comment, id: commentId });
});

app.patch('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const foundComment = comments.find(c => c.id === commentId);
  foundComment.comment = req.body.comment;
  res.redirect('/comments');
});

app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  comments = comments.filter(c => c.id !== commentId);
  res.redirect('/comments');
});

app.get('/comments', (req, res) => {
  res.render('comments/index', { comments });
});

app.post('/comments', (req, res) => {
  const newComment = {
    id: uuid(),
    username: req.body.username,
    comment: req.body.comment
  };
  comments.push(newComment);
  res.redirect('/comments');
});





app.listen (3000,()=>{
    console.log('Server is running on port 3000');
})