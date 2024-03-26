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
