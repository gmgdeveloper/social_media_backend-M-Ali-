// Middleware function to handle default route
const handleDefaultRoute = (req, res, next) => {
    // Check if user is authenticated (You can implement your own logic here)
    const isAuthenticated = req.user !== undefined; // Assuming req.user is set by the authenticateToken middleware

    // Check if user is authenticated
    if (isAuthenticated) {
        // User is authenticated, proceed to the requested route
        res.redirect('/api/users');
        next();
    } else {
        // User is not authenticated, redirect to login or register page
        res.redirect('/api/login'); // Redirect to login page
        // res.redirect('/register'); // Redirect to register page
    }
};

module.exports = handleDefaultRoute;
