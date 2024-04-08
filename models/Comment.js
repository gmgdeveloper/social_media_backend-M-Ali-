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

        if (result.affectedRows < 1) {
            throw new Error('Failed to create comment');
        }

        return {
            status: 201,
            message: 'Comment created successfully',
            comment: {
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

exports.getAllCommentsOfSinglePost = async (postId) => {
    try {
        // Check if the post ID is provided
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