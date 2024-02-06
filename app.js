// app.js
const constants = require('./config/constants.js');
const mysql = require('mysql2');

const express = require('express');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'Tushar_Riyat',
  password: 'Tushar@0311',
  database: 'sr_lifestyle_clinic',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
    
  // Now you can perform database queries or start your application logic here
  
  // Example: Perform a simple query
  connection.query('SELECT * FROM users', (queryError, results) => {
    if (queryError) {
      console.error('Error executing query:', queryError);
      return;
    }
    console.log('Query results:', results);
  });

  // Close the connection when done
  connection.end();
});
app.get('/urlBase', (req, res) => {
  res.send(`constants : ${constants.RESPONSE_CODES.OK}`);
  console.log('test get api');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/urlBase`);
});
