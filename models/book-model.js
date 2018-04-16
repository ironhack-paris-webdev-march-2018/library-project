const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { required: true, type: String },
  description: { type: String },
  author: { type: String, default: "Anonymous" },
  rating: { type: Number }
}, {
  timestamps: true
});

// create the "Book" model for the "books" collection
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
