require('dotenv').config();
const express = require('express');
const path = require('path');
const { logReqRes } = require('./middlewares');
const userRouter = require('./routes/user');
const { connectMongoDB } = require('./connection');

const app = express();

// Connecting Mongoose
connectMongoDB(`${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from "node_modules"
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


console.log(`my APP_NAME is ${process.env.APP_NAME}`)

// Middleware to parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rendering home route
app.get("/home", (req, res) => {
    res.render('home');
});

// Custom middleware
app.use(logReqRes('logs/log.txt'));

// Routes
app.use('/api/user', userRouter);

// Start the server
app.listen(process.env.PORT, () => console.log(`Server started on http://localhost:${process.env.PORT}`));
