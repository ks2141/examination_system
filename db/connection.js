const mongoose = require("mongoose");
module.exports = mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("DB connection successful...");
  })
  .catch((error) => {
    console.log("DB connection error =>", error);
  });
