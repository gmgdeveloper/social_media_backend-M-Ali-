const pool = require('../config/db');

// Model function to get all posts with user data
exports.getAllPostsWithUserData = async () => {
    try {
        // SQL query to join posts table with users table and order by post ID in descending order
        const sql = `
            SELECT posts.*, users.full_name, users.profile_picture
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            ORDER BY posts.id DESC
        `;
        console.log("sql", sql);
        const [posts] = await pool.query(sql);
        console.log("logging posts in model", posts);

        // Split the media column back into an array of filenames
        posts.forEach(post => {
            post.media = post.media.split(',');
        });

        // Construct response object with status, message, and fetched posts
        const response = {
            status: 200,
            message: "Posts fetched successfully",
            posts: posts
        };

        return response;
    } catch (error) {
        throw error;
    }
};


// Function to create a new post
exports.insertPost = async (userId, caption, media) => {
    try {
        // Get current date including hours and minutes
        const date = new Date();
        const currentDate = `${date}`;

        // Join media filenames into a single string separated by commas
        const mediaString = media.join(',');

        const values = [userId, caption, mediaString, currentDate];
        console.log("values", values);
        const sql = 'INSERT INTO posts (user_id, caption, media, post_date) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, values);

        // Check if the post was successfully created
        if (result.affectedRows < 1) {
            throw new Error('Failed to create post');
        }

        // Fetch and return the newly created post
        const postId = result.insertId;
        const newPost = await this.getPostById(postId);
        if (newPost) {
            return {
                status: 201,
                message: 'Post created successfully',
                data: newPost
            };
        } else {
            return {
                status: 500,
                message: 'Failed to create post'
            };
        }
    } catch (error) {
        console.error('Failed to create post:', error);
        return {
            status: 500,
            message: `Failed to create post: ${error.message}`
        };
    }
};

// Function to get a post by its ID
exports.getPostById = async (postId) => {
    try {
        const sql = 'SELECT posts.*, users.full_name, users.profile_picture FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = ?';
        const [rows] = await pool.query(sql, [postId]);

        // Check if a post with the given ID exists
        if (rows.length < 1) {
            err = {
                status: 404,
                message: 'Post not found'
            }
            return err;
        }

        // Separate media files if there are multiple
        const post = rows[0];
        const media = post.media.split(',');

        return {
            post: {
                id: post.id,
                caption: post.caption,
                media: media,
                user_id: post.user_id,
                // Assuming `full_name` and `profile_picture` are retrieved from the users table
                full_name: post.full_name,
                profile_picture: post.profile_picture,
                // Assuming `created_at` is a timestamp of post creation
                created_at: post.post_date,
            }
        };
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
        return err;
    }
};


// Function to get all posts by user ID
exports.getAllPostsByUserId = async (userId) => {
    try {
        const sql = 'SELECT posts.*, users.full_name, users.profile_picture FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.user_id = ?';
        const [rows] = await pool.query(sql, [userId]);

        // Iterate through each post to separate media files if there are multiple
        const posts = rows.map(post => {
            const media = post.media.split(',');
            return {
                id: post.id,
                caption: post.caption,
                media: media,
                user_id: post.user_id,
                // Assuming `full_name` and `profile_picture` are retrieved from the users table
                full_name: post.full_name,
                profile_picture: post.profile_picture,
                // Assuming `created_at` is a timestamp of post creation
                created_at: post.post_date,
            };
        });

        return posts;
    } catch (error) {
        console.error({
            status: 500,
            message: `Failed to get posts by user ID ${userId}: ${error.message}`,
            error: `Failed to get posts by user ID ${userId}: ${error}`,
        });
        throw new Error(`Failed to get posts by user ID ${userId}: ${error.message}`);
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

        // Initialize array to hold media filenames if media is to be updated
        let mediaValues = [];

        // Iterate over the fields to be updated and construct the SQL query
        Object.keys(updateFields).forEach((key, index) => {
            // Append field and value to the query
            if (key !== 'media') {
                sql += `${key} = ?`;
                values.push(updateFields[key]);
            } else {
                // Store media filenames separately to handle media update
                mediaValues = updateFields[key];
            }

            // Add comma if not the last field
            if (index < Object.keys(updateFields).length - 1) {
                sql += ', ';
            }
        });

        // Add WHERE condition for post ID
        sql += ' WHERE id = ?';
        values.push(postId);

        // Execute the update query
        const [result] = await pool.query(sql, [...values, postId]);

        // Check if the post was successfully updated
        if (result.affectedRows < 1) {
            throw new Error('Failed to update post');
        }

        // If media filenames are provided, update media field separately
        if (mediaValues.length > 0) {
            const updateMediaSql = 'UPDATE posts SET media = ? WHERE id = ?';
            await pool.query(updateMediaSql, [mediaValues.join(','), postId]);
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
