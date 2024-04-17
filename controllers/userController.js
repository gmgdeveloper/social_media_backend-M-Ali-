const userModel = require('../models/User');
const postModel = require("../models/Post");
const followModel = require("../models/Follow");
const multer = require('multer');
const path = require('path');
const env = require('dotenv');
env.config()

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

exports.getLoggedInUser = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await userModel.getUserByField("id", id);

        const posts = await postModel.getAllPostsByUserId(id);

        const followersResponse = await followModel.getFollowers(id);
        const followers = followersResponse.status === 200 ? followersResponse.followers : [];

        const followingResponse = await followModel.getFollowing(id);
        const following = followingResponse.status === 200 ? followingResponse.following : [];

        res.status(200).json({
            status: 200,
            message: 'User fetched successfully',
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
        console.error('Error fetching user:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
}

exports.getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.userId;

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

        res.status(200).json({
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
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
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

            const BASE_URL = process.env.BASE_URL || 'http://localhost';
            const PORT = process.env.PORT || 8000;

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

