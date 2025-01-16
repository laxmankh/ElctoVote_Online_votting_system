const express = require("express");
const app = express();
const db = require("./db");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const PORT = process.env.PORT;

const userRoute = require("./Routes/userRoute");
const candidateRoute = require("./Routes/candidateRoute");
app.use("/user", userRoute);
app.use("/candidate", candidateRoute);
app.listen(PORT, () => {
  console.log(`Application run on port ${PORT}`);
});
