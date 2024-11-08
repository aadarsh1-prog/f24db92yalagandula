var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gridRouter = require('./routes/grid'); // import the grid.js

var app = express();

// Define a simple Book class
class Book {
  constructor(id, title, author) {
    this.id = id;
    this.title = title;
    this.author = author;
  }
}

// Instantiate some books
const books = [
  new Book(1, '1984', 'George Orwell'),
  new Book(2, 'Brave New World', 'Aldous Huxley'),
  new Book(3, 'Fahrenheit 451', 'Ray Bradbury')
];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define the new route for books
app.get('/books', function(req, res, next) {
  const books = [
      { id: 1, title: "1984", author: "George Orwell" },
      { id: 2, title: "Brave New World", author: "Aldous Huxley" },
      { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury" }
  ];
  res.render('books', { books: books }); // Renders 'books.pug' with the books data
});


// Define the route for a specific book by ID
// Define the books route to render the books list using Pug
app.get('/books', function(req, res, next) {
  const books = [
      { id: 1, title: "1984", author: "George Orwell" },
      { id: 2, title: "Brave New World", author: "Aldous Huxley" },
      { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury" }
  ];
  res.render('books', { books: books }); // Render 'books.pug' with the books data
});

app.get('/grid', function(req, res, next) {
  let query = req.query;
  console.log(`rows: ${query.rows}`);
  console.log(`cols: ${query.cols}`);
  
  res.render('grid', { title: 'Grid Display', query: query });
});
// app.js (or pick.js)
app.get('/selector', (req, res) => {
  const image_names = [
    '1.jpeg', 
    '2.jpg', 
    '3.jpeg', 
    '4.jpeg', 
    '5.jpeg'
  ];

  res.render('randomitem', { image_names });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/grid', gridRouter); // set the route for grid

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
