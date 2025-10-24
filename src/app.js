const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());

// **** NEW CODE ****
// 1. Define and apply the global logger middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  // This will log to your terminal (like where nodemon is running)
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Apply the logger globally so it runs for every request
app.use(logger);
// **** END NEW CODE ****


// **** NEW CODE ****
// 2. Define the authentication middleware
const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const expectedToken = 'mysecrettoken';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authorization header missing or incorrect" });
  }

  const token = authHeader.split(' ')[1];

  if (token === expectedToken) {
    next(); // Token is valid, proceed to the route
  } else {
    return res.status(401).json({ message: "Authorization header missing or incorrect" });
  }
};
// **** END NEW CODE ****


const routes = require('./routes'); // Import the routes

// --- Your Existing Routes ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// **** NEW CODE ****
// 3. Add the public and protected routes from the task
app.get('/public', (req, res) => {
  res.status(200).send("This is a public route. No authentication required.");
});

// The checkAuth middleware is added ONLY to this route
app.get('/protected', checkAuth, (req, res) => {
  res.status(200).send("You have accessed a protected route with a valid Bearer token!");
});
// **** END NEW CODE ****


// --- Your Existing API Route Mounting ---
app.use('/api', routes); // Use the routes

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});