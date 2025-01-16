const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongo_url = process.env.Mongo_url;

const mongodbConnection = async () => {
  try {
    await mongoose.connect(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to mongodb");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

mongodbConnection();
const db = mongoose.connection;
module.exports = db;
