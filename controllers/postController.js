const postModel = require('../models/Post');

// Controller function to create a new post
exports.createPost = async (req, res) => {
    try {
        // Extract necessary data from the request body
        const { userId, caption, media } = req.body;

        // Validate if all required fields are provided
        if (!userId || !caption || !media) {
            return res.status(400).json({
                status: 400,
                error: 'Please provide userId, caption, and media'
            });
        }

        // Call the model function to create the post
        const newPost = await postModel.createPost(userId, caption, media);

        res.status(201).json({
            status: 201,
            message: 'Post created successfully',
            post: newPost
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
        const post = await postModel.getSinglePost(postId);

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
