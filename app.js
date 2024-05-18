const express = require('express');
const app = express();
const {connectMongoDB} = require('./connection.js');
const {logReqRes} = require('./middlewares');
const userRouter = require('./routes/user.js');
const PORT = 3000;
const MONGODB_PORT = 27017;

//Connecting Mongoose
connectMongoDB(`mongodb://127.0.0.1:${MONGODB_PORT}/MedEnrollHubDB`);
app.use(express.json());

//Middlewares
app.use(logReqRes('logs/log.txt'));
app.use("/api/user", userRouter);
app.listen(PORT, () => console.log('Server Started'));