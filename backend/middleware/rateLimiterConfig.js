const rateLimiterConfig = {
    "windowMs": 900000, // 15 minutes
    "max": 100, // limit each IP to 100 requests per windowMs
    "message": "Too many requests from this IP, please try again after a delay",
    "headers": true
};

module.exports = rateLimiterConfig;