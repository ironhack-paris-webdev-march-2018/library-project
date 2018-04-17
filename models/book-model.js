const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { required: true, type: String },
  description: { type: String },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author", // this id connects to the Author model
    required: true
  },
  rating: { type: Number },
  reviews: [
    {
      user: { type: String, required: true },
      comments: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

// create the "Book" model for the "books" collection
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
