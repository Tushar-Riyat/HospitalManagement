// app.js
const constants = require('./config/constants.js');


const express = require('express');
const app = express();
const port = 3000;

app.get('/urlBase', (req, res) => {
  res.send(`constants : ${constants.RESPONSE_CODES.OK}`);
  console.log('test get api');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/urlBase`);
});
