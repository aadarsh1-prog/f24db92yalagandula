require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const Costume = require('./models/costume'); // Import the Costume model
const resourceRouter = require('./routes/resource'); // Import resource router

// MongoDB connection string from environment variables
const connectionString = process.env.MONGO_CON;

// Connect to MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Database seeding logic
async function recreateDB() {
  // Delete all existing records
  await Costume.deleteMany();
  
  // Add new records
  const costumes = [
    { costume_type: "Ghost", size: "Large", cost: 15.4 },
    { costume_type: "Vampire", size: "Medium", cost: 25.5 },
    { costume_type: "Witch", size: "Small", cost: 10.0 },
  ];
  
  for (let data of costumes) {
    let instance = new Costume(data);
    await instance.save();
  }
}

let reseed = process.env.RESEED_DB === 'true'; // Control seeding via environment variable
if (reseed) recreateDB();

// Initialize express app
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gridRouter = require('./routes/grid');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/grid', gridRouter);
app.use('/resource', resourceRouter); // Resource router for costumes API

// Sample route for `/costumes` rendering all costumes
app.get('/costumes', async (req, res, next) => {
  try {
    const costumes = await Costume.find();
    res.render('costumes', { costumes });
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});
app.get('/create',function(req, res) {
  console.log("create view")
  try{
  res.render('costumecreate', { title: 'Costume Create'});
  }
  catch(err){
  res.status(500)
  res.send(`{'error': '${err}'}`);
  }
  }); 
// Example route for books
app.get('/books', (req, res) => {
  const books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "Brave New World", author: "Aldous Huxley" },
    { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury" },
  ];
  res.render('books', { books });
});

// Example route for grid display
app.get('/grid', (req, res) => {
  const query = req.query;
  res.render('grid', { title: 'Grid Display', query });
});

// Example route for random item selection
app.get('/selector', (req, res) => {
  const imageNames = ['1.jpeg', '2.jpg', '3.jpeg', '4.jpeg', '5.jpeg'];
  res.render('randomitem', { imageNames });
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
