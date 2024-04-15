const adminCheck = (req, res, next) => {
    const isAdmin = req.user.is_admin;
    const role = req.user.role;

    if (isAdmin === undefined && role === undefined || isAdmin === null && role === null) {
        return res.status(401).json({ status: 401, error: 'Access denied. Please log in first.' });
    }

    if (isAdmin !== 1 && role !== "admin") {
        return res.status(403).json({ status: 403, error: 'Access denied. Only admins are allowed to perform this action.' });
    }

    if (isAdmin === 1 && role === "admin") {
        next();
    } else {
        err = {
            status: 403,
            error: 'Access denied. Only administrators are allowed to perform this action.'
        }
        return res.status(403).json(err);
    }
};

module.exports = adminCheck;
