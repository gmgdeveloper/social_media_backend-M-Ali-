const postModel = require('../models/Post');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the MIME type of the file
        const isImage = file.mimetype.startsWith('image');
        const isVideo = file.mimetype.startsWith('video');

        // Set the destination path based on the file type
        let destPath = './public/uploads/posts/';

        if (isImage) {
            destPath += 'images/';
        } else if (isVideo) {
            destPath += 'videos/';
        } else {
            // Handle other file types if needed
            // For now, let's save them in a separate folder
            destPath += 'others/';
        }

        cb(null, destPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname);
    }
});

// Initialize Multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('media', 15); // Handle multiple files with a maximum of 15 files

// Check file type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|mp4/;
    // Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and videos only (JPEG, JPG, PNG, MP4)');
    }
}

// Controller function to create a new post
exports.createPost = async (req, res) => {
    try {
        // Call upload middleware to handle file upload
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    status: 400,
                    error: err.message
                });
            }

            // Get user id from token
            const user_id = req.user.id;

            // Extract necessary data from the request body
            const { caption } = req.body;

            // Extract uploaded media paths
            let media = [];
            if (req.files && req.files.length > 0) {
                // If multiple files are provided, iterate through them and save their paths
                media = req.files.map(file => file.path);
            } else if (req.file) {
                // If single file is provided, save its path
                media.push(req.file.path);
            }

            // Validate if caption or media is provided
            if (!caption && media.length === 0) {
                return res.status(400).json({
                    status: 400,
                    error: 'Please provide caption or media'
                });
            }

            // Call the model function to create the post
            const newPost = await postModel.insertPost(user_id, caption, media);

            // check if the post was created 
            if (newPost.status === 200 || newPost.status === 201) {
                res.status(201).json({
                    status: 201,
                    message: 'Post created successfully',
                    post: newPost
                });
            } else {
                res.status(newPost.status).json({
                    status: newPost.status,
                    error: newPost.message
                });
            }


        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

// Controller function to get all posts
exports.getAllPosts = async (req, res) => {
    try {
        // Call the model function to retrieve all posts
        const posts = await postModel.getAllPosts();

        res.status(200).json({
            status: 200,
            message: 'Posts fetched successfully',
            posts: posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

// Controller function to get a single post by ID
exports.getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Call the model function to retrieve the post by ID
        const post = await postModel.getPostById(postId);

        if (!post) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Post fetched successfully',
            post: post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

// Controller function to get all posts by user id
exports.getPostsByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Call the model function to retrieve the post by ID
        const posts = await postModel.getAllPostsByUserId(userId);

        if (!posts) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Posts fetched successfully',
            posts: posts
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

// Controller function to update post by id 
exports.updatePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized: User not logged in'
            });
        }

        // Check if the user is an admin
        if (req.user.role === 'admin') {
            // Admin can update any post, proceed with the update
            updatePost();
        } else {
            // User is not an admin, check if the user is the owner of the post
            const post = await postModel.getPostById(postId);

            if (!post) {
                return res.status(404).json({
                    status: 404,
                    error: 'Post not found'
                });
            }

            if (post.user_id !== req.user.id) {
                // User is not the owner of the post, forbid the update
                return res.status(401).json({
                    status: 401,
                    error: 'Forbidden: You are unauthorized to edit this post'
                });
            }

            // User is the owner of the post, proceed with the update
            updatePost();
        }

        async function updatePost() {
            // Check if a file is uploaded
            upload(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(400).json({
                        status: 400,
                        error: err.message
                    });
                }
                const { caption } = req.body
                // Initialize an object to store the fields to be updated
                const updateFields = {};

                // Check if a caption is provided
                if (caption !== undefined) {
                    updateFields.caption = caption;
                }

                // Check if a file is uploaded
                if (req.file) {
                    updateFields.media = req.file.path;
                }

                // Call the model function to update the post with the provided fields
                const updatedPost = await postModel.updatePost(postId, updateFields);

                res.status(200).json({
                    status: 200,
                    message: 'Post updated successfully',
                    post: updatedPost
                });
            });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
}


// Controller function to delete post by id
exports.deletePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Assuming the authenticated user ID is stored in req.user.id
        const userRole = req.user.role; // Assuming the authenticated user role is stored in req.user.role

        // Retrieve the post from the database
        const post = await postModel.getPostById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        // Check if the authenticated user is an admin
        if (userRole === 'admin' && req.user.is_admin === 1) {
            // Admin user can delete any post
            const deleteResult = await postModel.deletePost(postId);
            if (deleteResult.status === 200) {
                return res.status(deleteResult.status).json({
                    status: deleteResult.status,
                    message: 'Post deleted successfully'
                });
            } else {
                return res.status(deleteResult.status).json({
                    status: deleteResult.status,
                    error: deleteResult.error.message || 'Internal server error'
                });
            }
        }

        // Check if the authenticated user is the owner of the post
        if (post.user_id !== userId) {
            return res.status(401).json({
                status: 401,
                error: 'You are not authorized to delete this post'
            });
        }

        // Call the model function to delete the post
        const deleteResult = await postModel.deletePost(postId);

        // Check the status returned by the model function
        if (deleteResult.status === 200) {
            // Post deleted successfully
            res.status(deleteResult.status).json({
                status: deleteResult.status,
                message: 'Post deleted successfully'
            });
        } else {
            // Handle other status codes returned by the model function
            res.status(deleteResult.status).json({
                status: deleteResult.status,
                error: deleteResult.error || 'Internal server error'
            });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};
