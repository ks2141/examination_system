const jwt = require("jsonwebtoken");

exports.makeJwtToken = async (claims, expires) => {
  return jwt.sign(claims, process.env.SECRET, { expiresIn: expires });
};
exports.verifyJwtToken = async (token) => {
  return jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      let newError = new Error();
      newError.code = 401;
      newError.message = error;
      throw newError;
    }
    return decoded;
  });
};
