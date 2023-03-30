require("dotenv").config();
require("./db/connection");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { response } = require("./helpers/responseService");
const routes = require("./routes/index.routes");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  return response(res, 200, "Examination-System Demo");
});
app.all("*", (req, res) => {
  return response(res, 404, "Page not found!");
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on 127.0.0.1:${process.env.PORT}!`)
);
