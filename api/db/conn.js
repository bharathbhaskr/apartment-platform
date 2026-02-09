const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(process.env.ATLAS_URI);
  console.log("Successfully connected to MongoDB.");
};

module.exports = connectToDatabase;
