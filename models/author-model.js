const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String },
  nationality: { type: String },
  birthday: { type: Date },
  pictureUrl: {
    type: String,
    default: "https://media.giphy.com/media/129BxPDkIGnC6c/giphy.gif"
  }
}, {
  timestamps: true
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
