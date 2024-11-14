var express = require('express');
var router = express.Router();
var api_controller = require('../controllers/api');
var costume_controller = require('../controllers/costume');
const Costume = require('../models/costume');  // Import the Costume model

/// API ROUTE ///
// GET resources base.
router.get('/', api_controller.api);

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
