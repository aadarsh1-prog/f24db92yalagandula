var Costume = require('../models/costume');
// List of all Costumes
const mongoose = require('mongoose');
exports.costume_list = function(req, res) {
res.send('NOT IMPLEMENTED: Costume list');
};
// for a specific Costume.
exports.costume_detail = async function(req, res) {
    console.log("detail" + req.params.id)
    try {
    result = await Costume.findById( req.params.id)
    res.send(result)
    } catch (error) {
    res.status(500)
    res.send(`{"error": document for id ${req.params.id} not found`);
    }
};  
exports.costume_update_Page = async function(req, res) {
    console.log("update view for item "+req.query.id)
    try{
    let result = await Costume.findById(req.query.id)
    res.render('costumeupdate', { title: 'Costume Update', toShow: result });
    }
    catch(err){
    res.status(500)
    res.send(`{'error': '${err}'}`);
    }
    };  
// Handle Costume create on POST.
exports.costume_create_post = function(req, res) {
res.send('NOT IMPLEMENTED: Costume create POST');
};
// Handle Costume delete from on DELETE.
exports.costume_delete = async function(req, res) {
    console.log("delete " + req.params.id)
    try {
    result = await Costume.findByIdAndDelete( req.params.id)
    console.log("Removed " + result)
    res.send(result)
    } catch (err) {
    res.status(500)
    res.send(`{"error": Error deleting ${err}}`);
    }
    };    
// Handle Costume update form on PUT
exports.costume_update = async function(req, res) {
    console.log("Received request to update costume ID:", req.params.id); // Debug log
    try {
        // Convert ID to ObjectId to ensure compatibility with MongoDB
        const id = mongoose.Types.ObjectId(req.params.id);
        
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
        res.status(500).send({ error: `Error updating costume: ${error.message}` });
    }
};
exports.costume_list = async function(req, res) {
    try{
    theCostumes = await Costume.find();
    res.send(theCostumes);
    }
    catch(err){
    res.status(500);
    res.send(`{"error": ${err}}`);
    }
    };
    async function listAllCostumes(req, res) {
        try {
            // Fetch all costumes from the MongoDB collection
            const costumes = await Costume.find(); 
            
            // If successful, return the results as JSON
            res.json(costumes); 
        } catch (error) {
            // Catch any errors and return a 500 status with the error message
            res.status(500).json({ message: error.message });
        }
    }
    exports.costume_create_Page = function(req, res) {
        console.log("create view")
        try{
        res.render('costumecreate', { title: 'Costume Create'});
        }
        catch(err){
        res.status(500) 
        res.send(`{'error': '${err}'}`);
        }
        };        
    exports.costume_view_one_Page = async function(req, res) {
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
        };
    module.exports = { listAllCostumes }    