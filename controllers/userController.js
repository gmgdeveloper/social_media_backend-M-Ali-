const userModel = require('../models/User');
const postModel = require("../models/Post");
const followModel = require("../models/Follow");
const multer = require('multer');
const path = require('path');
const env = require('dotenv');
env.config()

const BASE_URL = process.env.BASE_URL || 'http://localhost';
const PORT = process.env.PORT || 8000;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profile') {
            cb(null, './public/uploads/profiles/');
        } else if (file.fieldname === 'cover') {
            cb(null, './public/uploads/covers/');
        }
    },
    filename: function (req, file, cb) {
        const prefix = file.fieldname === 'profile' ? 'profile-' : 'cover-';
        const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
        cb(null, prefix + '-' + Date.now() + "-" + fileNameWithoutSpaces);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only (JPEG, JPG, PNG)');
    }
}

const uploadProfileAndCover = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);


const uploadProfilePic = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profile');

const uploadCoverPic = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('cover');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();

        res.status(200).json({
            status: 200,
            message: 'Users fetched successfully',
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

exports.getUserProfileById = async (req, res) => {
    try {
        let userId;
        if (req.params.userId && req.params.userId.trim() !== '' || req.params.userId !== undefined) {
            userId = req.params.userId;
        } else if (req.user && req.user.id) {
            userId = req.user.id;
        } else {
            return res.status(400).json({
                status: 400,
                error: 'Invalid user ID'
            });
        }

        const user = await userModel.getUserByField('id', userId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                error: 'User not found'
            });
        }

        const followersResponse = await followModel.getFollowers(userId);
        const followers = followersResponse.status === 200 ? followersResponse.followers : [];

        const followingResponse = await followModel.getFollowing(userId);
        const following = followingResponse.status === 200 ? followingResponse.following : [];

        const posts = await postModel.getAllPostsByUserId(userId);

        return res.status(200).json({
            status: 200,
            message: 'User profile fetched successfully',
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                bio: user.bio,
                profile_pic: user.profile_picture,
                cover: user.cover_picture,
                role: user.role,
                is_admin: user.is_admin,
                is_active: user.is_active,
                registration_date: user.registration_date,
                followers_count: followers.length,
                following_count: following.length
            },
            followers: followers,
            following: following,
            posts: posts
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

exports.getSuggestedUsers = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ status: 400, error: 'User ID is missing in the request' });
        }

        const userId = req.user.id;

        const { limit } = req.body
        const userLimit = limit || 10;

        const followingResponse = await followModel.getFollowing(userId);

        if (followingResponse.status !== 200) {
            const recentUsers = await userModel.getRecentUsers(userLimit);
            const filteredRecentUsers = recentUsers.filter(user => user.id !== userId);
            return res.status(200).json({
                status: 200,
                message: 'Recent users fetched successfully',
                suggestedUsers: filteredRecentUsers
            });
        }

        const followingIds = followingResponse.following.map(user => user.id);

        let allFriends = [];

        for (const followingId of followingIds) {
            const friendsResponse = await followModel.getAllFriends(followingId);
            if (friendsResponse.status !== 200) {
                continue;
            }
            allFriends = allFriends.concat(friendsResponse.friends);
        }

        allFriends = allFriends.filter((friend, index, self) =>
            index === self.findIndex((f) => f.id === friend.id)
        );

        const suggestedUsers = allFriends.filter(friend => friend.id !== userId);

        const suggestedUsersWithMutual = [];

        for (const suggestedUser of suggestedUsers) {
            const friendsResponse = await followModel.getAllFriends(suggestedUser.id);
            if (friendsResponse.status === 200) {
                const mutualFriends = friendsResponse.friends.filter(friend => followingIds.includes(friend.id));
                suggestedUser.mutualFriends = mutualFriends;
                suggestedUser.mutualFriendsCount = mutualFriends.length;
                suggestedUsersWithMutual.push(suggestedUser);
            }
        }

        suggestedUsersWithMutual.filter()

        const loggedInUserData = await userModel.getUserData(userId);

        if (suggestedUsersWithMutual.length !== 0) {
            return res.status(200).json({
                status: 200,
                message: 'Suggested users fetched successfully',
                loggedInUser: loggedInUserData.user,
                suggestedUsers: suggestedUsersWithMutual
            });
        }

        if (loggedInUserData.status == 200) {
            const recentUsers = await userModel.getRecentUsers(userLimit);
            const filteredRecentUsers = recentUsers.filter(user => user.id !== userId && !followingIds.includes(user.id));
            return res.status(200).json({
                status: 200,
                message: 'Recent users fetched successfully',
                suggestedUsers: filteredRecentUsers
            });
        }
    } catch (error) {
        console.error('Error fetching suggested users:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.stepTwo = async (req, res) => {
    const { bio } = req.body;

    if (!bio) {
        return res.status(400).json({
            status: 400,
            error: 'Please provide a bio!'
        });
    }

    const id = req.user.id;

    if (!id) {
        return res.status(400).json({
            status: 400,
            error: 'Not authorized!'
        });
    }

    const user = await userModel.getUserByField("id", id);

    if (!user) {
        return res.status(400).json({
            status: 400,
            error: 'Please complete step 1 first!'
        });
    }

    try {
        const updatedUser = await userModel.updateUserFields(id, { bio }, "Step 2 completed! Your data have been updated.");

        if (updatedUser.status === 200) {
            res.status(200).json({
                status: updatedUser.status,
                message: updatedUser.message,
                user: updatedUser.data
            });
        } else {
            res.status(404).json({
                status: 404,
                error: 'Failed to update user data',
                message: updatedUser
            });
        }
    } catch (error) {
        console.error('Error updating user bio:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

exports.stepThree = async (req, res) => {
    uploadProfileAndCover(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(400).json({
                    status: 400,
                    error: 'Multer error: ' + err.message
                });
            } else if (err) {
                console.log(err);
                return res.status(500).json({
                    status: 500,
                    error: 'Internal server error: ' + err
                });
            }

            if (!req.files || !req.files['profile'] || !req.files['cover']) {
                return res.status(400).json({
                    status: 400,
                    error: 'Both profile and cover images are required'
                });
            }

            const userId = req.user.id;

            const profileImagePath = `${BASE_URL}:${PORT}/uploads/profiles/${req.files['profile'][0].filename}`;
            const coverImagePath = `${BASE_URL}:${PORT}/uploads/covers/${req.files['cover'][0].filename}`;


            const updatedUser = await userModel.updateUserFields(userId, {
                profile_picture: profileImagePath,
                cover_picture: coverImagePath,
                is_active: 1
            }, "Step 3 completed! Profile and cover images uploaded successfully");

            if (updatedUser.status === 200) {
                res.status(updatedUser.status).json({
                    status: updatedUser.status,
                    message: updatedUser.message,
                    user: updatedUser.data
                });
            } else {
                res.status(updatedUser.status).json({
                    status: updatedUser.status,
                    error: updatedUser.message,
                });
            }


        } catch (error) {
            console.error('Error uploading profile and cover images:', error.message);
            res.status(500).json({
                status: 500,
                error: `Internal server error: ${error.message}`
            });
        }
    });
};

exports.updateProfilePic = async (req, res) => {
    uploadProfilePic(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(400).json({
                    status: 400,
                    error: 'Multer error: ' + err.message
                });
            } else if (err) {
                console.log(err);
                return res.status(500).json({
                    status: 500,
                    error: 'Internal server error: ' + err
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: 'Profile image is required'
                });
            }

            const userId = req.user.id;

            // Construct the profile image path
            const profileImagePath = `${BASE_URL}:${PORT}/uploads/profiles/${req.file.filename}`;

            // Update user's profile picture in the database
            const updatedUser = await userModel.updateUserFields(userId, {
                profile_picture: profileImagePath
            }, "Profile picture updated successfully");

            if (updatedUser.status === 200) {
                res.status(updatedUser.status).json({
                    status: updatedUser.status,
                    message: updatedUser.message,
                    user: updatedUser.data
                });
            } else {
                res.status(updatedUser.status).json({
                    status: updatedUser.status,
                    error: updatedUser.message,
                });
            }
        } catch (error) {
            console.error('Error updating profile picture:', error.message);
            res.status(500).json({
                status: 500,
                error: `Internal server error: ${error.message}`
            });
        }
    });
};

exports.updateCoverPic = async (req, res) => {
    uploadCoverPic(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(400).json({
                    status: 400,
                    error: 'Multer error: ' + err.message
                });
            } else if (err) {
                console.log(err);
                return res.status(500).json({
                    status: 500,
                    error: 'Internal server error: ' + err
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: 'Cover image is required'
                });
            }

            const userId = req.user.id;

            // Construct the cover image path
            const coverImagePath = `${BASE_URL}:${PORT}/uploads/covers/${req.file.filename}`;

            // Update user's cover picture in the database
            const updatedUser = await userModel.updateUserFields(userId, {
                cover_picture: coverImagePath
            }, "Cover picture updated successfully");

            if (updatedUser.status === 200) {
                res.status(updatedUser.status).json({
                    status: updatedUser.status,
                    message: updatedUser.message,
                    user: updatedUser.data
                });
            } else {
                res.status(updatedUser.status).json({
                    status: updatedUser.status,
                    error: updatedUser.message,
                });
            }
        } catch (error) {
            console.error('Error updating cover picture:', error.message);
            res.status(500).json({
                status: 500,
                error: `Internal server error: ${error.message}`
            });
        }
    });
};
