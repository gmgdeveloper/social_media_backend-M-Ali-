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
        const sql = 'INSERT INTO posts (user_id, caption, media) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [userId, caption, media]);

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

exports.updatePost = async (postId, caption, media) => {
    try {
        const sql = 'UPDATE posts SET caption =?, media =? WHERE id =?';
        const [result] = await pool.query(sql, [caption, media, postId]);

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
        const sql = 'DELETE FROM posts WHERE id =?';
        const [result] = await pool.query(sql, [postId]);

        // Check if the post was successfully deleted
        if (result.affectedRows !== 1) {
            throw new Error('Failed to delete post');
        }

        // Fetch and return the deleted post
        const deletedPost = await this.getPostById(postId);
        return deletedPost;
    } catch (error) {
        throw new Error(error);
    }
};

// Other functions for updating, deleting, and retrieving posts can be added here
