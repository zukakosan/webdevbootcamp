const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('List of all shelters');
});

router.post('/', (req, res) => {
  res.send('Add a new shelter');
});

router.get('/:id', (req, res) => {
  res.send(`Details of shelter with ID: ${req.params.id}`);
});

router.get('/:id/edit', (req, res) => {
    res.send(`Edit shelter with ID: ${req.params.id}`);
});

module.exports = router;