const likeModel = require("../models/like")
const postModel = require("../models/Post")



exports.likePost = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized: User not logged in'
            });
        }
        const postId = req.params.id;
        const userId = req.user.id;
        const post = await postModel.getPostById(postId);
        // Check if the post exists
        if (!post) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        const likeResult = await likeModel.likePost(postId, userId);
        if (likeResult.status === 201) {
            return res.status(likeResult.status).json({
                status: likeResult.status,
                message: 'Post liked successfully'
            });
        } else {
            return res.status(likeResult.status).json({
                status: likeResult.status,
                error: likeResult.error || 'Internal server error',
                message: likeResult.message || 'Internal server error'
            });
        }

    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};
