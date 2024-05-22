const express = require('express');
const path = require('path');
const { logReqRes } = require('./middlewares');
const userRouter = require('./routes/user');
const { connectMongoDB } = require('./connection');

const PORT = 3000;
const MONGODB_PORT = 27017;
const app = express();

// Connecting Mongoose
connectMongoDB(`mongodb://127.0.0.1:${MONGODB_PORT}/MedEnrollHubDB`);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


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
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
