const pool = require('../config/db');

// Function to get all likes on a post
exports.getLikesOfPost = async () => {
    try {
        const sql = 'SELECT * FROM likes where postId =?';
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to like a post
exports.likePost = async (postId, userId) => {
    try {
        const sql = 'INSERT INTO likes (post_id, user_id) VALUES (?,?)';
        const [rows] = await pool.query(sql, [postId, userId]);
        if (rows.affectedRows > 0) {
            success = {
                status: 201,
                message: 'Post liked successfully'
            }
            return success
        } else {
            err = {
                status: 500,
                message: 'Something went wrong!',
                error: "The server can not connect to database please try again after a while."
            }
            return err
        }
    } catch (error) {
        console.error(error);
        errMsg = {
            status: 500,
            message: 'Something went wrong! It is from our side',
            error: error.message
        }
    }
};