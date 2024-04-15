const adminCheck = (req, res, next) => {
    const isAdmin = req.user.is_admin;
    const is_Admin = req.user.role

    if (isAdmin === undefined && is_Admin === undefined || isAdmin === null && is_Admin === null) {
        return res.status(401).json({ status: 401, error: 'Access denied. Please log in first.' });
    }

    if (isAdmin !== 1) {
        return res.status(403).json({ status: 403, error: 'Access denied. Only admins are allowed to perform this action.' });
    }

    if (isAdmin === 1 && is_Admin == "admin") {
        next();
    } else {
        err = {
            status: 403,
            error: 'Access denied. Only administrators are allowed to perform this action.'
        }
    }
};

module.exports = adminCheck;
