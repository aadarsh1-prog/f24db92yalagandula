const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');

// Route to get all shoes
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new shoe
router.post('/', async (req, res) => {
  const shoe = new Shoe({
    shoe_type: req.body.shoe_type,
    size: req.body.size,
    cost: req.body.cost
  });

  try {
    const newShoe = await shoe.save();
    res.status(201).json(newShoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get a specific shoe by ID
router.get('/:id', getShoe, (req, res) => {
  res.json(res.shoe);
});

// Route to update a specific shoe by ID
router.patch('/:id', getShoe, async (req, res) => {
  if (req.body.shoe_type != null) {
    res.shoe.shoe_type = req.body.shoe_type;
  }
  if (req.body.size != null) {
    res.shoe.size = req.body.size;
  }
  if (req.body.cost != null) {
    res.shoe.cost = req.body.cost;
  }

  try {
    const updatedShoe = await res.shoe.save();
    res.json(updatedShoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a specific shoe by ID
router.delete('/:id', getShoe, async (req, res) => {
  try {
    await res.shoe.remove();
    res.json({ message: 'Deleted Shoe' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a shoe by ID
async function getShoe(req, res, next) {
  let shoe;
  try {
    shoe = await Shoe.findById(req.params.id);
    if (shoe == null) {
      return res.status(404).json({ message: 'Cannot find shoe' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.shoe = shoe;
  next();
}

module.exports = router;
