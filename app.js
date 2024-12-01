require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const Costume = require('./models/costume'); // Import the Costume model
const resourceRouter = require('./routes/resource'); // Import resource router
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
  Account.findOne({ username: username })
  .then(function (user){
  if (err) { return done(err); }
  if (!user) {
  return done(null, false, { message: 'Incorrect username.' });
  }
  if (!user.validPassword(password)) {
  return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
  })
  .catch(function(err){
  return done(err)
  })
  })
  )
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
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());  
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); 
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
app.get('/create', (req, res) => {
  res.render('costumecreate', { title: 'Create Costume' });
});
app.get('/update',async function(req, res) {
  console.log("update view for item " + req.query.id);
  try {
    let result = await Costume.findById(req.query.id);
    
    if (!result) {
      // If no costume is found, show an error or redirect
      return res.status(404).send('Costume not found');
    }
    
    res.render('costumeupdate', { title: 'Costume Update', toShow: result });
  } catch (err) {
    res.status(500).send(`{'error': '${err}'}`);
  }
});
app.get('/delete',  async function(req, res) {
  console.log("Delete view for id " + req.query.id)
  try{
  result = await Costume.findById(req.query.id)
  res.render('costumedelete', { title: 'Costume Delete', toShow:result });
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
app.post('/resource/costumes', (req, res) => {
  const { costume_type, size, cost } = req.body;

  // Create a new Costume object
  const newCostume = new Costume({
    costume_type,
    size,
    cost
  });

  // Save the new costume to the database
  newCostume.save()
    .then(() => {
      res.json({ message: 'Costume created successfully!' }); // Return success message as JSON
    })
    .catch((error) => {
      console.error('Error creating costume:', error);
      res.status(500).json({ error: 'Failed to create costume' }); // Return error message as JSON
    });
});
app.get('/login', function(req, res) {
  res.render('login', { title: 'Costume App Login', user : req.user });
  });
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
  });
app.get('/logout', function(req, res) {
  req.logout(function(err) {
  if (err) { return next(err); }
  res.redirect('/');
  });
  });
app.get('/ping', function(req, res){
  res.status(200).send("pong!");
  });
app.put('/costumes/:id', async (req, res) => {
  console.log("Received request to update costume ID:", req.params.id); // Debug log
  try {
      // Correct way to create ObjectId
      const id = new mongoose.Types.ObjectId(req.params.id);
      // Update the costume using the ID and the data in req.body
      const updatedCostume = await Costume.findByIdAndUpdate(id, req.body, { new: true });
      if (updatedCostume) {
          console.log("Updated costume:", updatedCostume); // Debug log for updated costume
          res.send(updatedCostume); // Send the updated document back as response
      } else {
          console.log("Costume not found for update"); // Debug log if no document found for update
          res.status(404).send({ error: `Costume with id ${req.params.id} not found` });
      }
  } catch (error) {
      console.error("Error updating costume:", error); // Debug log for error
      res.status(500).send({ error: `Error : ${error.message}` });
  }
});
var Account =require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
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
