const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("DB connection failed", error);
      process.exit(1);
    });
};
