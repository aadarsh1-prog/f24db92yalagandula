const mongoose = require("mongoose");

const costumeSchema = mongoose.Schema({
  costume_type: {
    type: String,
    required: [true, "Costume type is required"], 
  },
  size: {
    type: String,
    required: [true, "Size is required"],  
  },
  cost: {
    type: Number,
    validate: {
      validator: function(value) {
        return value <= 100;  // Custom validator to ensure cost is not greater than 100
      },
      message: "Price can't be greater than 100 or Negative",  // Error message if validation fails
    },
  },
});

module.exports = mongoose.model("Costume", costumeSchema);
