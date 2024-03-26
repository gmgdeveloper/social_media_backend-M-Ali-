const jwt = require('jsonwebtoken');



// Middleware function to verify JWT token
const authenticateToken = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request object
        next(); // User is authenticated, proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = authenticateToken;
