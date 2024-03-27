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
}).single('media'); // 'media' should match the name attribute in the form input field for uploading the image or video

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
                return res.status(400).json({
                    status: 400,
                    error: err.message
                });
            }

            // Extract necessary data from the request body
            const { user_id, caption } = req.body;
            const media = req.file ? req.file.path : null;

            // Validate if all required fields are provided
            if (!user_id || !caption) {
                return res.status(400).json({
                    status: 400,
                    error: 'Please provide caption'
                });
            }

            // Call the model function to create the post
            const newPost = await postModel.insertPost(user_id, caption, media);

            res.status(201).json({
                status: 201,
                message: 'Post created successfully',
                post: newPost
            });
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
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

// Controller function update post by id 
exports.updatePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const { caption } = req.body;
        const media = req.file ? req.file.path : null;
        const updatedPost = await postModel.updatePost(postId, caption, media);
        res.status(200).json({
            status: 200,
            message: 'Post updated successfully',
            post: updatedPost
        });

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
        const deletedPost = await postModel.deletePost(postId);
        res.status(200).json({
            status: 200,
            message: 'Post deleted successfully',
            post: deletedPost
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
}