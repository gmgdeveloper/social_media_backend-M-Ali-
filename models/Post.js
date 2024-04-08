const pool = require('../config/db');

exports.getAllPostsWithUserData = async () => {
    try {
        const sql = `
            SELECT posts.*, users.full_name, users.profile_picture
            FROM posts
            INNER JOIN users ON posts.user_id = users.id
            ORDER BY posts.id DESC
        `;
        const [posts] = await pool.query(sql);

        for (const post of posts) {
            // Fetch comments for each post
            const commentsSql = `
                SELECT comments.*, users.full_name AS commenter_name, users.profile_picture AS commenter_profile_picture
                FROM comments
                INNER JOIN users ON comments.user_id = users.id
                WHERE comments.post_id = ?
            `;
            const [comments] = await pool.query(commentsSql, [post.id]);
            post.comments = comments;

            // Fetch likes for each post
            const likesSql = `
                SELECT likes.*, users.full_name AS liker_name, users.profile_picture AS liker_profile_picture
                FROM likes
                INNER JOIN users ON likes.user_id = users.id
                WHERE likes.post_id = ?
            `;
            const [likes] = await pool.query(likesSql, [post.id]);
            post.likes = likes;

            // Convert media string to array
            post.media = post.media.split(',');
        }

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

exports.insertPost = async (userId, caption, media) => {
    try {
        const date = new Date();
        const options = {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };
        const currentDate = date.toLocaleString('en-US', options);

        const formattedDate = currentDate.replace(/ GMT\+\d{4} \(.*\)$/, '');

        const mediaString = media.join(',');

        const values = [userId, caption, mediaString, formattedDate];
        const sql = 'INSERT INTO posts (user_id, caption, media, post_date) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, values);

        if (result.affectedRows < 1) {
            throw new Error('Failed to create post');
        }

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

exports.getPostById = async (postId) => {
    try {
        // Fetch post details
        const postQuery = 'SELECT posts.*, users.full_name, users.profile_picture FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = ?';
        const [postRows] = await pool.query(postQuery, [postId]);

        if (postRows.length < 1) {
            return {
                status: 404,
                message: 'Post not found'
            };
        }

        const post = postRows[0];
        const media = post.media.split(',');

        // Fetch comments of the post
        const commentQuery = `
            SELECT comments.*, users.full_name AS commenter_name, users.profile_picture AS commenter_profile_picture
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
        `;
        const [commentRows] = await pool.query(commentQuery, [postId]);

        // Fetch likes of the post
        const likeQuery = `
            SELECT likes.*, users.full_name AS liker_name, users.profile_picture AS liker_profile_picture
            FROM likes
            INNER JOIN users ON likes.user_id = users.id
            WHERE likes.post_id = ?
        `;
        const [likeRows] = await pool.query(likeQuery, [postId]);

        return {
            status: 200,
            message: 'Post retrieved successfully',
            post: {
                id: post.id,
                caption: post.caption,
                media: media,
                user_id: post.user_id,
                full_name: post.full_name,
                profile_picture: post.profile_picture,
                like_count: post.like_count,
                comment_count: post.comment_count,
                created_at: post.post_date,
                comments: commentRows,
                likes: likeRows
            }
        };
    } catch (error) {
        console.error('Error getting single post:', error);
        return {
            status: 500,
            message: `Failed to get single post: ${error.message}`
        };
    }
};

exports.getAllPostsByUserId = async (userId) => {
    try {
        // Fetch posts by user ID
        const sql = 'SELECT posts.*, users.full_name, users.profile_picture FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.user_id = ?';
        const [rows] = await pool.query(sql, [userId]);

        // Iterate through each post
        const posts = [];
        for (const post of rows) {
            // Fetch comments for the current post
            const commentsSql = `
                SELECT comments.*, users.full_name AS commenter_name, users.profile_picture AS commenter_profile_picture
                FROM comments
                INNER JOIN users ON comments.user_id = users.id
                WHERE comments.post_id = ?
            `;
            const [comments] = await pool.query(commentsSql, [post.id]);

            // Fetch likes for the current post
            const likesSql = `
                SELECT likes.*, users.full_name AS liker_name, users.profile_picture AS liker_profile_picture
                FROM likes
                INNER JOIN users ON likes.user_id = users.id
                WHERE likes.post_id = ?
            `;
            const [likes] = await pool.query(likesSql, [post.id]);

            // Prepare post object with comments and likes
            const media = post.media.split(',');
            const preparedPost = {
                id: post.id,
                caption: post.caption,
                media: media,
                user_id: post.user_id,
                full_name: post.full_name,
                profile_picture: post.profile_picture,
                like_count: post.like_count,
                comment_count: post.comment_count,
                created_at: post.post_date,
                likes: likes,
                comments: comments
            };

            // Add the prepared post to the posts array
            posts.push(preparedPost);
        }

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

exports.updatePost = async (postId, updateFields) => {
    try {
        if (Object.keys(updateFields).length === 0) {
            console.log('No fields provided for update');
            const errObj = {
                status: 400,
                message: 'No fields provided for update'
            };
            return errObj;
        }

        const sql = 'UPDATE posts SET ';
        const values = [];
        const mediaValues = [];

        let sqlFields = '';
        Object.keys(updateFields).forEach((key, index) => {
            if (key !== 'media') {
                sqlFields += `${key} = ?`;
                values.push(updateFields[key]);

            } else {
                mediaValues.push(updateFields[key]);
            }
        });

        if (sqlFields !== '' && mediaValues.length > 0) {
            sqlFields += ', ';
        }
        if (mediaValues.length > 0) {
            sqlFields += 'media = ?';
            values.push(mediaValues.join(','));
        }

        sqlFields += ' WHERE id = ?';
        values.push(postId);
        await pool.query(sql + sqlFields, [...values]);
        const updatedPost = await this.getPostById(postId);

        const success = {
            status: 200,
            message: 'Post updated successfully',
            data: updatedPost
        }

        return success;
    } catch (error) {
        console.error(error);
        const errObj = {
            status: 500,
            message: `Failed to update post: ${error.message}`,
        };
        return errObj;
    }
};

exports.updatePostLikeCount = async (postId, likeCount) => {
    try {
        const sql = 'UPDATE posts SET like_count = ? WHERE id = ?';
        const [result] = await pool.query(sql, [likeCount, postId]);
        if (result.affectedRows < 1) {
            err = {
                status: 500,
                message: `Failed to update post's like count.`,
            }
            return err
        }

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

exports.updateCommentCount = async (postId, commentCount) => {
    try {
        const sql = 'UPDATE posts SET comment_count = ? WHERE id = ?';
        const [result] = await pool.query(sql, [commentCount, postId]);
        if (result.affectedRows < 1) {
            err = {
                status: 500,
                message: `Failed to update post's comment count.`,
            };
            return err;
        }

        const updatedPost = await this.getPostById(postId);
        return updatedPost;
    } catch (error) {
        console.error({
            status: 500,
            message: `Failed to update post comment count: ${error.message}`,
            error: `Failed to update post comments ${postId}: ${error}`,
        });
        err = {
            status: 500,
            message: `Failed to update post's comment count: ${error.message}`,
        };
        return err;
    }
};

exports.deletePost = async (postId) => {
    try {
        const sql = 'DELETE FROM posts WHERE id = ?';
        const [result] = await pool.query(sql, [postId]);

        if (result.affectedRows !== 1) {
            return {
                status: 404,
                message: 'Post not found or could not be deleted',
                error: 'Post not found or could not be deleted'
            };
        }

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
