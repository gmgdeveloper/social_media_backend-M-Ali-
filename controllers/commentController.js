const commentModel = require("../models/Comment")
const postModel = require("../models/Post")

exports.createComment = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) {
            return res.status(401).json({
                status: 401,
                message: 'You must be logged in to comment on this post'
            });
        }

        const postId = parseInt(req.params.id);
        const post = await postModel.getPostById(postId);
        if (!post) {
            return res.status(404).json({
                status: 404,
                message: 'Post not found'
            });
        }

        const { comment } = req.body;

        const newComment = await commentModel.createComment(userId, postId, comment);

        if (newComment.status === 201) {
            return res.status(201).json({
                status: 201,
                message: 'Comment created successfully',
                comment: newComment.comment
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Something went wrong'
            });
        }
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({
            status: 500,
            message: `Internal server error: ${error.message}`
        });
    }
};

exports.getAllCommentsOfAPost = async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
        const post = await postModel.getPostById(postId);
        if (!post) {
            return res.status(404).json({
                status: 404,
                message: 'Post not found'
            });
        }

        const commentsResult = await commentModel.getAllCommentsOfSinglePost(postId);
        
        if (commentsResult.status === 200) {
            return res.status(200).json({
                status: 200,
                message: 'Comments retrieved successfully',
                comments: commentsResult.comments
            });
        } else {
            return res.status(commentsResult.status).json({
                status: commentsResult.status,
                message: commentsResult.message
            });
        }
    } catch (error) {
        console.error('Error retrieving comments:', error);
        return res.status(500).json({
            status: 500,
            message: `Failed to retrieve comments: ${error.message}`
        });
    }
};
