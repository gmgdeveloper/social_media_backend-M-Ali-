const adminCheck = (req, res, next) => {
    const isAdmin = req.user.isAdmin;

    if (isAdmin === undefined || isAdmin === null) {
        return res.status(401).json({ status: 401, error: 'Access denied. Please log in first.' });
    }

    if (isAdmin !== 1) {
        return res.status(403).json({ status: 403, error: 'Access denied. Only admins are allowed to perform this action.' });
    }

    if (isAdmin === 1) {
        next();
    } else {
        err = {
            status: 403,
            error: 'Access denied. Only administrators are allowed to perform this action.'
        }
    }
};

module.exports = adminCheck;
