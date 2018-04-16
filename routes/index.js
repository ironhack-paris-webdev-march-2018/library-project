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

// STEP #1 of CREATE form (show the form)
router.get('/book/add', (req, res, next) => {
  res.render('book-form');
});

// STEP #5 of CREATE form (server processes)
router.post('/process-book', (req, res, next) => {
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    .then(() => {
      // redirect ONLY to URLs
      // (redirect so we don't get duplicate data on refresh)

      // STEP #6 of CREATE form (server responds)
      res.redirect('/books');
    })
    .catch((err) => {
      next(err);
    });
});

// STEP #1 of UPDATE form (show the form)
router.get('/book/:bookId/edit', (req, res, next) => {
  Book.findById(req.params.bookId)
    .then((bookDetails) => {
      res.locals.bookId = req.params.bookId;
      res.locals.book = bookDetails;
      res.render('book-edit');
    })
    .catch((err) => {
      next(err);
    });
});

// STEP #5 of UPDATE form (server processes)
router.post('/process-edit/:bookId', (req, res, next) => {
  const { title, author, description, rating } = req.body;

  Book.findByIdAndUpdate(
    req.params.bookId,                      // which document to update
    { title, author, description, rating }, // what changes to make
    { runValidators: true }                 // extra settings
  )
  .then(() => {
    // STEP #6 of UPDATE form (server responds)
    res.redirect(`/book/${req.params.bookId}`);
  })
  .catch((err) => {
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

router.get('/book/:bookId/delete', (req, res, next) => {
  Book.findByIdAndRemove(req.params.bookId)
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
