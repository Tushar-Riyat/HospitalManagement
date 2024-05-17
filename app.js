
const RESPONSE_CODES = require('./config/constants.js');
const {connectMongoDB} = require('./connection.js');
const {logReqRes} = require('./middlewares');
const mongoose = require('mongoose');
const emailValidator = require('emailvalid');
const EmailValidation = new emailValidator();
const app = express();
const PORT = 3000;

//Connecting Mongoose
connectMongoDB('mongodb://127.0.0.1:27017/MedEnrollHubDB');

async function isEmailValid(email){
  console.log(email);
  return emailValidator.validate(email);
}

//Middleware - Plugin
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));

app.get('/usersList/:userID', (req, res) => {
  const userID = Number(req.params.userID);
  const user = usersData.find((user) => user.id === userID);
  return res.json(user);
});

app.listen(PORT, () => console.log('Server Started'));