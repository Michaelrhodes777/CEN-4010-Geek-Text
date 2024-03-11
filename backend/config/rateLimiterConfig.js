const rateLimiterConfig = {
    "windowMs": 10 * 1000, // 10 seconds
    "max": 5, // limit each IP to 5 requests per 10 seconds
    "message": "Too many requests from this IP, please try again after a delay",
    "headers": true
};

module.exports = rateLimiterConfig;