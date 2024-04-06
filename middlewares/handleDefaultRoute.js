const handleDefaultRoute = (req, res, next) => {

    const isAuthenticated = req.user !== undefined;

    if (isAuthenticated) {
        res.redirect('/api/users');
        next();
    } else {
        res.redirect('/api/login');
    }
};

module.exports = handleDefaultRoute;
