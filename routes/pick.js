// pick.js
const express = require('express');
const app = express();
const path = require('path');

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like images) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// pick.js (route handler)
app.get('/selector', (req, res) => {
  const image_names = [
    'gus.jpeg', 
    'hank.jpeg', 
    'saul.jpeg', 
    'skyler.jpeg', 
    'walter.jpeg'
  ];

  res.render('randomitem', { image_names });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
