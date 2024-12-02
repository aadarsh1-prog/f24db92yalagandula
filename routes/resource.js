var express = require('express');
var router = express.Router();
var api_controller = require('../controllers/api');
var costumeController = require('../controllers/costume');
const Costume = require('../models/costume');  // Import the Costume model
var mongoose = require('mongoose'); 
var passport = require('passport');
const secured = (req, res, next) => {
  if (req.user){
  return next();
  }
  res.redirect("/login");
  }
/// API ROUTE ///
// GET resources base.
router.get('/', api_controller.api);
router.get('/create', function(req, res) {
  console.log("create view")
  try{
    res.render('costumecreate', { title: 'Costume Create'});
  }
  catch(err){
    res.status(500)
    res.send(`{'error': '${err}'}`);
  }
});

router.put('/costumes/:id', async (req, res) => {
  console.log("Received request to update costume ID:", req.params.id); // Debug log
  try {
      // Correct way to create ObjectId
      const id = new mongoose.Types.ObjectId(req.params.id);
      // Update the costume using the ID and the data in req.body
      const updatedCostume = await Costume.findByIdAndUpdate(id, req.body, { new: true });
      if (updatedCostume) {
          console.log("Updated costume:", updatedCostume); // Debug log for updated costume
          res.send(updatedCostume); // Send the updated document back as response
      } else {
          console.log("Costume not found for update"); // Debug log if no document found for update
          res.status(404).send({ error: `Costume with id ${req.params.id} not found` });
      }
  } catch (error) {
      console.error("Error updating costume:", error); // Debug log for error
      res.status(500).send({ error: `Error : ${error.message}` });
  }
});
router.get('/update/:id',secured, async function(req, res) {
  console.log("update view for item "+req.query.id)
  try{
  let result = await Costume.findById(req.query.id)
  res.render('costumeupdate', { title: 'Costume Update', toShow: result });
  }
  catch(err){
  res.status(500)
  res.send(`{'error': '${err}'}`);
  }
  });
  router.get('/delete',  async function(req, res) {
    console.log("Delete view for id " + req.query.id)
    try{
    result = await Costume.findById(req.query.id)
    res.render('costumedelete', { title: 'Costume Delete', toShow:
    result });
    }
    catch(err){
    res.status(500)
    res.send(`{'error': '${err}'}`);
    }
    });
router.delete('/costumes/:id', async function(req, res) {
  console.log("delete " + req.params.id)
  try {
  result = await Costume.findByIdAndDelete( req.params.id)
  console.log("Removed " + result)
  res.send(result)
  } catch (err) {
  res.status(500)
  res.send(`{"error": Error deleting ${err}}`);
  }
  });
router.get('/detail', async function(req, res) {
  console.log("single view for id " + req.query.id)
  try{
  result = await Costume.findById( req.query.id)
  res.render('costumedetail',
  { title: 'Costume Detail', toShow: result });
  }
  catch(err){
  res.status(500)
  res.send(`{'error': '${err}'}`);
  }
  });
// Route to fetch and display costumes
router.get("/items", async (req, res, next) => {
  try {
    const costumes = await Costume.find(); // Fetch all costumes from the database
    res.render('costumes', { title: 'Costumes List', costumes: costumes }); // Render the Pug template
  } catch (err) {
    next(err); // Handle errors
  }
});
router.get('/login', function(req, res) {
  res.render('login', { title: 'Costume App Login', user : req.user });
  });
  router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
  });
  router.get('/logout', function(req, res) {
  req.logout(function(err) {
  if (err) { return next(err); }
  res.redirect('/');
  });
  });
  router.get('/ping', function(req, res){
  res.status(200).send("pong!");
  });
  module.exports = router;
  router.get('/ping', function(req, res){
  res.status(200).send("pong!");
  });
  module.exports = router;
// POST route to create a new costume
// POST to create a new costume
router.post('/costumes', async (req, res) => {
  const { costume_type, size, cost } = req.body;
  
  // Create a new Costume instance
  const newCostume = new Costume({
    costume_type,
    size,
    cost
  });

  try {
    // Save the costume to the database
    const savedCostume = await newCostume.save();

    // Render a confirmation page with the saved costume details
    res.json({
      message: "Costume created successfully",
      costume: savedCostume
    });
  } catch (err) {
    res.status(500).send("Error creating costume: " + err);
  }
});
router.get('/costumes/:id',async (req, res) => {
  console.log("Received request for costume ID:", req.params.id); // Debug log
  try {
      const result = await Costume.findById(req.params.id);
      if (result) {
          console.log("Found costume:", result); // Debug log for result
          res.send(result);
      } else {
          console.log("Costume not found"); // Debug log if no result
          res.status(404).send({ error: `Costume with id ${req.params.id} not found` });
      }
  } catch (error) {
      console.error("Error retrieving costume:", error); // Debug log for error
      res.status(500).send({ error: `Error retrieving costume: ${error.message}` });
  }
});

module.exports = router;
