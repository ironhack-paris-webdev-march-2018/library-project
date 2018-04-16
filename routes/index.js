const express = require('express');

const Book = require('../models/book-model');

const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/about', (req, res, next) => {
  res.render('about-page');
});

router.get('/books', (req, res, next) => {
  Book.find()
    .then((booksFromDb) => {
      // send the database results to the view
      res.locals.bookList = booksFromDb;
      res.render('books-page');
    })
    .catch((err) => {
      // show the error page with this error
      next(err);
    });
});

router.get('/book/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId)
    .then((bookDetails) => {
      res.locals.book = bookDetails;
      res.render('single-book-page');
    })
    .catch((err) => {
      // show the error page with this error
      next(err);
    });
});

module.exports = router;
