const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "Sathwik", {
    expiresIn: "10d",
  });
};

module.exports = generateToken;
