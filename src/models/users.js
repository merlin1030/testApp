const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: String,
    password: String,
  },
  {
    timestmps: true,
  }
);

module.exports = model("User", userSchema); //module.exports para importar el modelo en otros lugares
