const express = require('express');
const router = express.Router();

// この Router にアクセスするたびに実行されるミドルウェアとして定義
router.use((req, res, next) => {
  if (req.query.isAdmin) {
    return next();
  } else {
    res.send('You are not an admin!');
  }
});

router.get('/', (req, res) => {
  res.send('Admin Dashboard');
});

router.get('/secret', (req, res) => {
  res.send('Secret Admin Area');
});

router.get('/deleteall', (req, res) => {
  res.send('Delete All Users');
});

module.exports = router;
