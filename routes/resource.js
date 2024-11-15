var express = require('express');
var router = express.Router();
var api_controller = require('../controllers/api');
var costume_controller = require('../controllers/costume');
const Costume = require('../models/costume');  // Import the Costume model
var mongoose = require('mongoose'); 
/// API ROUTE ///
// GET resources base.
router.get('/', api_controller.api);
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
// Route to fetch and display costumes
router.get("/items", async function(req, res) {
    try {
        const costumes = await Costume.find();  // Fetch all costumes from DB
        
        // Create a string to display in the browser
        let costumeText = "";
        costumes.forEach(costume => {
            costumeText += `Costume Type: ${costume.costume_type}, Size: ${costume.size}, Cost: $${costume.cost}\n`;
        });

        // Send plain text response
        res.type('text/plain');  // Set the response type to plain text
        res.send(costumeText); // Send the list of costumes as a response
    } catch (err) {
        res.status(500).send("Error retrieving costumes: " + err);
    }
});
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
    res.render('x', {
      message: "Costume created successfully",
      costume: savedCostume
    });
  } catch (err) {
    res.status(500).send("Error creating costume: " + err);
  }
});

module.exports = router;
