const likeModel = require("../models/like")
const postModel = require("../models/Post")

exports.likeAndUnlikePost = async (req, res) => {
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

        // Check if the user has already liked the post
        const existingLike = await likeModel.getLikeByUserIdAndPostId(userId, postId);
        if (existingLike) {
            // User has already liked the post, so unlike it
            await likeModel.unlikePost(postId, userId);
            return res.status(200).json({
                status: 200,
                message: 'Post unliked successfully'
            });
        } else {
            // User has not liked the post yet, so like it
            await likeModel.likePost(postId, userId);
            return res.status(201).json({
                status: 201,
                message: 'Post liked successfully'
            });
        }

    } catch (error) {
        console.error('Error liking/unliking post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

exports.getAllLikesOfAPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Call the model function to get all likes of a post
        const likes = await likeModel.getAllLikesOfAPost(postId);

        res.status(200).json({
            status: 200,
            message: 'Successfully retrieved likes of the post',
            likes: likes
        });
    } catch (error) {
        console.error('Error retrieving likes of the post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};
