const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

if (!process.env.MONGO_URI) {
  require("dotenv").config({
    path: path.join(__dirname, "../.env"),
  });
}

const app = express();

mongoose.connect(
  process.env.MONGO_URI
);

app.get('/', async (req, res) => {
  res.send('Docker Assignment Working-1!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

console.log(process.env.PORT);
console.log(process.env.MONGO_URI);
console.log(process.env.JWT_SECRET);