const moongose = require("mongoose");
const { Schema } = moongose;

const RecipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false },
});

module.exports = RecipientSchema;
