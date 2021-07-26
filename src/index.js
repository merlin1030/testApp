const express = require("express");
const app = express();
const cors = requite("cors");

require("./database");
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/index"));

app.listen(3000);
console.log("Sucrose its on port", 3000);
