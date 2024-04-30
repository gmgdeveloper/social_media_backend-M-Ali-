const FollowModel = require('../models/Follow');

exports.followUser = async (req, res) => {
    try {
        const { followingId } = req.body;
        const followerId = req.user.id;

        const isFollowing = await FollowModel.getFollowStatus(followerId, followingId);
        if (isFollowing) {
            return res.status(400).json({
                status: 400,
                message: 'You are already following this user'
            });
        }

        if (followerId === followingId) {
            return res.status(400).json({
                status: 400,
                message: 'You cannot follow yourself'
            })
        }

        const result = await FollowModel.followUser(followerId, followingId);

        if (result.status === 201) {
            return res.status(201).json({
                status: 201,
                message: 'User followed successfully'
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Something went wrong'
            });
        }
    } catch (error) {
        console.error('Error following user:', error);
        return res.status(500).json({
            status: 500,
            message: `Internal server error: ${error.message}`
        });
    }
};


exports.unfollowUser = async (req, res) => {
    try {
        const { followingId } = req.body;
        const followerId = req.user.id
        const result = await FollowModel.unfollowUser(followerId, followingId);

        if (result.status === 200) {
            return res.status(200).json({
                status: 200,
                message: 'User unfollowed successfully'
            });
        } else {
            return res.status(result.status || 500).json({
                status: result.status || 500,
                message: result.message || 'Something went wrong'
            });
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return res.status(500).json({
            status: 500,
            message: `Internal server error: ${error.message}`
        });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const followers = await FollowModel.getFollowers(userId);

        if (followers.status === 200) {
            return res.status(200).json(followers);
        } else {
            return res.status(followers.status).json({
                status: followers.status,
                message: followers.message
            });
        }
    } catch (error) {
        console.error('Error retrieving followers:', error);
        return res.status(500).json({
            status: 500,
            message: `Internal server error: ${error.message}`
        });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const following = await FollowModel.getFollowing(userId);

        if (following.status === 200) {
            return res.status(200).json(following);
        } else {
            return res.status(following.status).json({
                status: following.status,
                message: following.message
            });
        }
    } catch (error) {
        console.error('Error retrieving following:', error);
        return res.status(500).json({
            status: 500,
            message: `Internal server error: ${error.message}`
        });
    }
};

exports.getFriends = async (req, res) => {
    try {
        let userId;
        // Check if userId is provided in the request params
        if (req.params.userId !== undefined) {
            userId = req.params.userId;
        } else {
            // If userId is not provided, use the logged-in user's id
            userId = req.user.id;
        }

        // Check if userId is valid
        if (!userId) {
            return res.status(400).json({ status: 400, error: 'Invalid user ID' });
        }

        // Fetch friends for the specified userId
        const friends = await FollowModel.getAllFriends(userId);

        // Check if the response status is 200
        if (friends.status === 200) {
            return res.status(200).json(friends);
        } else {
            // Handle other status codes (e.g., 404, 500) returned by the model
            return res.status(friends.status).json({ status: friends.status, error: friends.error });
        }
    } catch (error) {
        // Handle unexpected errors
        console.error('Error fetching friends:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};
