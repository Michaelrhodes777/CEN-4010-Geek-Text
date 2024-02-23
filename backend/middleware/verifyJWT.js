
const { InvalidAccessTokenError } = require('./util/custom-errors');

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) throw new InvalidAccessTokenError('No roles provided.');

    const rolesArray = [...allowedRoles];
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    
    if (!result) throw new InvalidAccessTokenError('User does not have the required roles.');

    next();
  }
}

module.exports = verifyRoles;
