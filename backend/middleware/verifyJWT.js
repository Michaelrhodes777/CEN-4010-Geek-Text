const jwt = require('jsonwebtoken');
const { InvalidAccessTokenError, ExpiredAccessTokenError } = require('./util/custom-errors');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    // Here we throw a new InvalidAccessTokenError instead of returning a 401 status directly
    return next(new InvalidAccessTokenError('No token provided.'));
  }
  const token = authHeader.split(' ')[1];
  console.log(token)
  
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        // Differentiate between expired token and other token related errors
        if (err.name === 'TokenExpiredError') {
          return next(new ExpiredAccessTokenError('Token has expired.'));
        } else {
          return next(new InvalidAccessTokenError('Token is invalid.'));
        }
      }
      
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};

module.exports = verifyJWT;
