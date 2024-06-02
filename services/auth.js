const jwt = require("jsonwebtoken");
const secret = "SecretKey1234";
function setUser(user) {
  return jwt.sign(user, secret);
}

function getUser(token) {
  if (token)
  return jwt.verify(token, secret);
  return null;
}

module.exports = {
  setUser,
  getUser,
};
