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
                comment: newComment.comment,
                commentCount: commentCount
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

exports.editComment = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) {
            return res.status(401).json({
                status: 401,
                message: 'You must be logged in to edit a comment'
            });
        }

        const commentId = parseInt(req.params.id);
        const updatedComment = req.body.comment;

        const existingComment = await commentModel.getCommentById(commentId);
        if (!existingComment) {
            return res.status(404).json({
                status: 404,
                message: 'Comment not found'
            });
        }

        if (existingComment.user_id !== userId) {
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to edit this comment'
            });
        }

        const result = await commentModel.updateComment(commentId, updatedComment);

        if (result.status === 200) {
            return res.status(result.status || 200).json({
                status: result.status || 200,
                message: result.message || 'Comment updated successfully',
                comment: result.comment || updatedComment
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Failed to update comment'
            });
        }
    } catch (error) {
        console.error('Error editing comment:', error);
        return res.status(500).json({
            status: 500,
            message: `Internal server error: ${error.message}`
        });
    }
};

exports.deleteCommentById = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await commentModel.getCommentById(commentId);

        if (!comment) {
            return res.status(404).json({
                status: 404,
                error: 'Comment not found'
            });
        }

        if (userRole === 'admin' && req.user.is_admin === 1) {
            const deleteResult = await commentModel.deleteComment(commentId);
            if (deleteResult.status === 200) {
                return res.status(deleteResult.status).json({
                    status: deleteResult.status,
                    message: 'Comment deleted successfully'
                });
            } else {
                return res.status(deleteResult.status).json({
                    status: deleteResult.status,
                    error: deleteResult.error || 'Internal server error'
                });
            }
        }

        if (comment.user_id !== userId) {
            return res.status(401).json({
                status: 401,
                error: 'You are not authorized to delete this comment'
            });
        }

        const deleteResult = await commentModel.deleteComment(commentId);

        if (deleteResult.status === 200) {
            res.status(deleteResult.status).json({
                status: deleteResult.status || 200,
                message: deleteResult.message || 'Comment deleted successfully'
            });
        } else {
            res.status(deleteResult.status).json({
                status: deleteResult.status || 500,
                error: deleteResult.error || 'Internal server error'
            });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};