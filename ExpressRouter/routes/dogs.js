const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('List of all dogs');
});

router.post('/', (req, res) => {
  res.send('Add a new dog');
});

router.get('/:id', (req, res) => {
  res.send(`Details of dog with ID: ${req.params.id}`);
});

router.get('/:id/edit', (req, res) => {
    res.send(`Edit dog with ID: ${req.params.id}`);
});

module.exports = router;