
const { InvalidAccessTokenError } = require('./util/custom-errors');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // If no roles are attached to the request object, throw an InvalidAccessTokenError
    if (!req.roles) {
      throw new InvalidAccessTokenError('No roles provided');
    }

    const rolesArray = [...allowedRoles];
    // Check if any of the roles attached to the request object are allowed
    const hasRole = req.roles.some(role => rolesArray.includes(role));

    // If the user does not have any of the allowed roles, throw an InvalidAccessTokenError
    if (!hasRole) {
      throw new InvalidAccessTokenError('User does not have the required roles');
    }

    // If everything is fine, call the next middleware
    next();
  }
}

module.exports = verifyRoles;
