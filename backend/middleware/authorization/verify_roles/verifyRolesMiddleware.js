const { InvalidAccessTokenError } = require('./util/custom-errors');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) {
      throw new InvalidAccessTokenError('No roles provided');
    }

    const rolesArray = [...allowedRoles];
    const hasRole = req.roles.some(role => rolesArray.includes(role));

    if (!hasRole) {
      throw new InvalidAccessTokenError('User does not have the required roles');
    }

    next();
  }
}

module.exports = verifyRoles;