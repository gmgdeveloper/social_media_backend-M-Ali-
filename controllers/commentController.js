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
        
        const userCommentCount = await commentModel.getUserCommentCount(userId, postId);
        if (userCommentCount >= 3) {
            return res.status(400).json({
                status: 400,
                message: 'You have reached the maximum limit of comments on this post'
            });
        }

        const { comment } = req.body;

        const newComment = await commentModel.createComment(userId, postId, comment);

        if (newComment.status === 201) {

            const comments = await commentModel.getAllCommentsOfSinglePost(postId);
            const commentCount = parseInt(comments.comments.length);

            const updatedCommentCount = await postModel.updateCommentCount(postId, commentCount);
            if (updatedCommentCount.status === 500) {
                return res.status(400).json({
                    status: 400,
                    message: 'Cannot update post comment count because the post does not exist or has been deleted'
                });
            }

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
