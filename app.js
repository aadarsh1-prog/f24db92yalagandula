require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); // Move mongoose declaration here
const Costume = require('./models/costume');  // Import the model
 // Import body-parser to parse JSON request bodies
const costumeRouter = require('./routes/resource');  // Import the costume router

// Get MongoDB connection string from environment variables
const connectionString = process.env.MONGO_CON;

// Connect to MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

  async function recreateDB() {
    // Delete all existing records
    await Costume.deleteMany();
  
    // Add new records
    let instance1 = new Costume({
      costume_type: "ghost",
      size: "large",
      cost: 15.4
    });
    await instance1.save();
  
    let instance2 = new Costume({
      costume_type: "Vampire",
      size: "Medium",
      cost: 25.5
    });
    await instance2.save();
  
    let instance3 = new Costume({
      costume_type: "Witch",
      size: "Small",
      cost: 10.0
    });
    await instance3.save();
  }
  
let reseed = process.env.RESEED_DB === 'true';  // Control seeding via environment variable
if (reseed) { recreateDB(); }

// Initialize express app
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gridRouter = require('./routes/grid'); 
const resourceRouter = require('./routes/resource');  // Add this line to import resourceRouter

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resource', costumeRouter);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function(){
  console.log("Connection to DB succeeded");
});

// Define the route for costumes
app.get('/costumes', async (req, res, next) => {
  try {
    const costumes = await Costume.find(); // Retrieve all costumes from the database
    res.render('costumes', { costumes: costumes }); // Render costumes view with the data
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});
app.get('/resource/costumes', async (req, res, next) => {
  try {
    const costumes = await Costume.find(); // Retrieve all costumes from the database
    res.render('costumes', { costumes: costumes }); // Render costumes view with the data
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});

// Define the route for books
app.get('/books', function(req, res, next) {
  const books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "Brave New World", author: "Aldous Huxley" },
    { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury" }
  ];
  res.render('books', { books: books });
});

app.get('/grid', function(req, res, next) {
  let query = req.query;
  console.log(`rows: ${query.rows}`);
  console.log(`cols: ${query.cols}`);
  
  res.render('grid', { title: 'Grid Display', query: query });
});

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
app.use('/grid', gridRouter); // Set the route for grid
app.use('/resource', resourceRouter); // Set the route for resource

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
