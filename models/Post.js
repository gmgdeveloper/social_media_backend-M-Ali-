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

// Model function to get all posts with user data
exports.getAllPostsWithUserData = async () => {
    try {
        // SQL query to join posts table with users table
        const sql = `
            SELECT posts.*, users.full_name, users.profile_picture
            FROM posts
            JOIN users ON posts.user_id = users.id
            `;
        const [posts] = await pool.query(sql);
        return posts;
    } catch (error) {
        throw error;
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
        if (newPost) {
            const success = {
                status: 201,
                message: 'Post created successfully',
                data: newPost
            }
            return success;
        } else {
            const err = {
                status: 500,
                message: 'Failed to create post'
            }
            return err
        }
    } catch (error) {
        console.log(error);
        err = {
            status: 500,
            message: `Failed to get create post: ${error.message}`,
        }
        return err

    }
};

// Function to get a post by its ID
exports.getPostById = async (postId) => {
    try {

        const sql = 'SELECT * FROM posts WHERE id = ?';
        const [rows] = await pool.query(sql, [postId]);

        // Check if a post with the given ID exists
        if (rows.length < 1) {
            err = {
                status: 404,
                message: 'Post not found'
            }
            return err
        }

        return rows[0];
    } catch (error) {
        console.error({
            status: 500,
            message: `Failed to get single post: ${error.message}`,
            error: `Failed to get post with ID ${postId}: ${error}`
        });
        err = {
            status: 500,
            message: `Failed to get single post: ${error.message}`,
        }
        return err
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

// Function to update like count 
exports.updatePostLikeCount = async (postId, likeCount) => {
    try {
        const sql = 'UPDATE posts SET like_count = ? WHERE id = ?';
        const [result] = await pool.query(sql, [likeCount, postId]);
        // Check if the post was successfully updated
        if (result.affectedRows < 1) {
            err = {
                status: 500,
                message: `Failed to update post's like count.`,
            }
            return err
        }

        // Fetch and return the updated post
        const updatedPost = await this.getPostById(postId);
        return updatedPost;
    } catch (error) {
        console.error({
            status: 500,
            message: `Failed to update post like count: ${error.message}`,
            error: `Failed to update post likes ${postId}: ${error}`
        });
        err = {
            status: 500,
            message: `Failed to update post's like count: ${error.message}`,
        }
        return err
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
