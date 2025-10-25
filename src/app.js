const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);


const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const expectedToken = 'mysecrettoken';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authorization header missing or incorrect" });
  }

  const token = authHeader.split(' ')[1];

  if (token === expectedToken) {
    next(); 
  } else {
    return res.status(401).json({ message: "Authorization header missing or incorrect" });
  }
};


const routes = require('./routes'); // Import the routes

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/public', (req, res) => {
  res.status(200).send("This is a public route. No authentication required.");
});

app.get('/protected', checkAuth, (req, res) => {
  res.status(200).send("You have accessed a protected route with a valid Bearer token!");
});


app.use('/api', routes); 

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
