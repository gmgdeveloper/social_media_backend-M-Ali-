const pool = require('../config/db');

exports.getAllLikesOfAPost = async (postId) => {
    try {
        const sql = 'SELECT * FROM likes WHERE post_id = ?';
        const [likes] = await pool.query(sql, [postId]);
        return likes;
    } catch (error) {
        console.error(error);
        errMsg = {
            status: 500,
            message: 'Something went wrong! It is from our side',
            error: error.message
        }
        return errMsg;
    }
};

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
        return errMsg;
    }
};

exports.getLikeByUserIdAndPostId = async (userId, postId) => {
    try {
        const sql = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
        const [rows] = await pool.query(sql, [userId, postId]);
        return rows[0];
    } catch (error) {
        console.error('Error retrieving like:', error);
        return { status: 500, error: error.message };
    }
};

exports.unlikePost = async (postId, userId) => {
    try {
        const sql = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
        const [result] = await pool.query(sql, [postId, userId]);

        if (result.affectedRows === 0) {
            return { status: 200, message: 'Post not liked' };
        }

        return { status: 200, message: 'Post unliked successfully' };
    } catch (error) {
        console.error('Error unliking post:', error);
        return { status: 500, error: error.message };
    }
};

