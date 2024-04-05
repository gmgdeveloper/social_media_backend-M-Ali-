const userModel = require('../models/User');
const postModel = require("../models/Post");
const multer = require('multer');
const path = require('path');

// Set storage engine for Multer for profile and cover images
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
        cb(null, prefix + Date.now() + "-" + file.originalname);
    }
});

// Check file type for profile and cover images
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

// Initialize Multer upload for profile and cover images
const uploadProfileAndCover = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]); // Specify field names for profile and cover images

// Controller function to get all users
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userModel.getAllUsers();

        // Return the list of users
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

// Controller function to get a single user
exports.getLoggedInUser = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await userModel.getUserByField("id", id);

        // Get all posts of user 
        const posts = await postModel.getAllPostsByUserId(id);

        if (user.id == req.user.id) {
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
                    registration_date: user.registration_date
                },
                posts: posts
            })
        } else (
            res.status(404).json({
                status: 404,
                error: 'User not found'
            })
        )

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
}

// Controller function for creating profile step-2
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

    // Check if the provided userId corresponds to a registered user who completed step 1
    const user = await userModel.getUserByField("id", id);

    if (!user) {
        return res.status(400).json({
            status: 400,
            error: 'Please complete step 1 first!'
        });
    }

    // Update the user's data information in the database
    try {
        // Call the updateUserFields function to update user's data in the database
        const updatedUser = await userModel.updateUserFields(id, { bio }, "Step 2 completed! Your data have been updated.");

        // Check if the update was successful
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

// Controller function for uploading user profile and cover images
exports.stepThree = async (req, res) => {
    uploadProfileAndCover(req, res, async (err) => {
        try {
            // Check for Multer errors
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

            // Check if both profile and cover images are provided
            if (!req.files || !req.files['profile'] || !req.files['cover']) {
                return res.status(400).json({
                    status: 400,
                    error: 'Both profile and cover images are required'
                });
            }

            // Get user ID from the authenticated user
            const userId = req.user.id;

            // Get profile and cover image file paths
            const profileImagePath = req.files['profile'][0].filename;
            const coverImagePath = req.files['cover'][0].filename;

            // Update user record in the database with the profile and cover image paths
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

