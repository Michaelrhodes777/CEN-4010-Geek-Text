const { InvalidAccessTokenError } = require('../Errors.js');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.role) {
            throw new InvalidAccessTokenError('No roles provided');
        }

        const rolesArray = [...allowedRoles];
        const hasRole = rolesArray.includes(req.role);

        if (!hasRole) {
            throw new InvalidAccessTokenError('User does not have the required roles');
        }

        next();
    }
}

module.exports = verifyRoles;