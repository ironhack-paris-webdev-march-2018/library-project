const express = require('express');

const Book = require('../models/book-model');
const Author = require('../models/author-model');

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
    .populate('author')
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
  Author.find()
    .then((authorsFromDb) => {
      res.locals.authorList = authorsFromDb;
      res.render('book-form');
    })
    .catch((err) => {
      next(err);
    })
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
  Promise.all([
    Book.findById(req.params.bookId),
    Author.find()
  ])
  .then((results) => {
    res.locals.bookId = req.params.bookId;
    res.locals.book = results[0];
    res.locals.authorList = results[1];
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
    .populate('author')
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

router.get('/author/add', (req, res, next) => {
  res.render('author-form');
});

router.post('/process-author', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;

  Author.create({ name, lastName, nationality, birthday, pictureUrl })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/book/:bookId/process-review', (req, res, next) => {
  const { user, comments } = req.body;

  Book.findByIdAndUpdate(
    req.params.bookId,
    {  // push to the "reviews" array
      $push: { reviews: { user, comments } }
    },
    { runValidators: true }
  )
  .then(() => {
    res.redirect(`/book/${req.params.bookId}`);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
