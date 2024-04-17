const pool = require('../config/db');

exports.createComment = async (userId, postId, comment) => {
    try {
        if (!userId || !postId) {
            throw new Error('User ID and post ID are required');
        }

        if (!comment) {
            throw new Error('Comment text is required');
        }

        const date = new Date();
        const formattedDate = date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).replace(/ GMT\+\d{4} \(.*\)$/, '');

        const query = `INSERT INTO comments (comment_text, post_id, user_id, created_at) VALUES (?,?,?,?)`;
        const values = [comment, postId, userId, formattedDate];
        const result = await pool.query(query, values);


        if (result[0].affectedRows < 1) {
            console.error('Failed to create comment');
            return { status: 500, message: 'Failed to create comment' };
        }

        const commentId = result[0].insertId;

        return {
            status: 201,
            message: 'Comment created successfully',
            comment: {
                id: commentId,
                comment_text: comment,
                post_id: postId,
                user_id: userId,
                created_at: formattedDate
            }
        };
    } catch (error) {
        console.error('Error creating comment:', error);
        return {
            status: 500,
            message: `Failed to create comment: ${error.message}`
        };
    }
};


exports.getUserCommentCount = async (userId, postId) => {
    try {
        const sql = 'SELECT COUNT(*) AS commentCount FROM comments WHERE user_id = ? AND post_id = ?';
        const [rows] = await pool.query(sql, [userId, postId]);
        const { commentCount } = rows[0];
        return commentCount;
    } catch (error) {
        console.error('Error retrieving user comment count:', error);
        throw error;
    }
};

exports.getAllCommentsOfSinglePost = async (postId) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required');
        }

        const query = `
            SELECT comments.*, users.full_name, users.profile_picture 
            FROM comments 
            INNER JOIN users ON comments.user_id = users.id 
            WHERE comments.post_id = ?
        `;
        const [result] = await pool.query(query, [postId]);

        if (result.length > 0) {
            return {
                status: 200,
                message: 'Comments retrieved successfully',
                comments: result
            };
        } else {
            const empty = {
                status: 404,
                message: 'There are no comments on this post yet!',
                comments: []
            };
            return empty;
        }
    } catch (error) {
        console.error('Error retrieving comments:', error);
        return {
            status: 500,
            message: `Failed to retrieve comments: ${error.message}`
        };
    }
};

exports.getCommentById = async (commentId) => {
    try {
        const sql = 'SELECT * FROM comments WHERE id = ?';
        const [rows] = await pool.query(sql, [commentId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error getting comment by ID:', error);
        return { status: 500, error: error.message };
    }
};

exports.updateComment = async (commentId, updatedComment) => {
    try {
        const sql = 'UPDATE comments SET comment_text = ? WHERE id = ?';
        const [result] = await pool.query(sql, [updatedComment, commentId]);
        if (result.affectedRows < 1) {
            return { status: 404, message: 'Comment not found' };
        }

        const updatedCommentData = await this.getCommentById(commentId);

        return { status: 200, message: 'Comment updated successfully', comment: updatedCommentData };
    } catch (error) {
        console.error('Error updating comment:', error);
        return { status: 500, error: error.message };
    }
};

exports.deleteComment = async (commentId) => {
    try {
        const sql = 'DELETE FROM comments WHERE id = ?';
        const [result] = await pool.query(sql, [commentId]);

        if (result.affectedRows !== 1) {
            return {
                status: 404,
                message: 'Comment not found or could not be deleted',
                error: 'Comment not found or could not be deleted'
            };
        }

        return {
            status: 200,
            message: 'Comment deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting comment:', error);
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
};
