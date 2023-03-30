const mongoose = require("mongoose");
mongoose.set('sanitizeFilter',true)
mongoose.set('sanitizeProjection', true);
mongoose.set("strictQuery", true);
module.exports = mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("DB connection successful...");
  })
  .catch((error) => {
    console.log("DB connection error =>", error);
  });
