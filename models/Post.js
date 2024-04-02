const pool = require('../config/db');

// Function to get all posts
exports.getAllPosts = async () => {
    try {
        const sql = 'SELECT * FROM posts';
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to create a new post
exports.insertPost = async (userId, caption, media) => {
    try {

        // Get current date icluding hours and minutes
        const date = new Date();
        const currentDate = `${date}`;
        const sql = 'INSERT INTO posts (user_id, caption, media, post_date) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [userId, caption, media, currentDate]);

        // Check if the post was successfully created
        if (result.affectedRows < 1) {
            throw new Error('Failed to create post');
        }

        // Fetch and return the newly created post
        const postId = result.insertId;
        const newPost = await this.getPostById(postId);
        return newPost;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to get a post by its ID
exports.getPostById = async (postId) => {
    try {
        const sql = 'SELECT * FROM posts WHERE id = ?';
        const [rows] = await pool.query(sql, [postId]);

        // Check if a post with the given ID exists
        if (rows.length !== 1) {
            throw new Error('Post not found');
        }

        return rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to get all posts by user ID
exports.getAllPostsByUserId = async (userId) => {
    try {
        const sql = 'SELECT * FROM posts WHERE user_id = ?';
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to update a post
exports.updatePost = async (postId, updateFields) => {
    try {
        if (Object.keys(updateFields).length === 0) {
            throw new Error('No fields provided for update');
        }

        let sql = 'UPDATE posts SET ';
        const values = [];

        // Iterate over the fields to be updated and construct the SQL query
        Object.keys(updateFields).forEach((key, index) => {
            // Append field and value to the query
            sql += `${key} = ?`;
            values.push(updateFields[key]);

            // Add comma if not the last field
            if (index < Object.keys(updateFields).length - 1) {
                sql += ', ';
            }
        });

        // Add WHERE condition for post ID
        sql += ' WHERE id = ?';
        values.push(postId);

        // Execute the update query
        const [result] = await pool.query(sql, values);

        // Check if the post was successfully updated
        if (result.affectedRows < 1) {
            throw new Error('Failed to update post');
        }

        // Fetch and return the updated post
        const updatedPost = await this.getPostById(postId);
        return updatedPost;
    } catch (error) {
        throw new Error(error.message);
    }
};



// Function to delete a post
exports.deletePost = async (postId) => {
    try {
        const sql = 'DELETE FROM posts WHERE id = ?';
        const [result] = await pool.query(sql, [postId]);

        // Check if the post was successfully deleted
        if (result.affectedRows !== 1) {
            return {
                status: 404,
                message: 'Post not found or could not be deleted',
                error: 'Post not found or could not be deleted'
            };
        }

        // Post successfully deleted
        return {
            status: 200,
            message: 'Post deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting post:', error);
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
};
