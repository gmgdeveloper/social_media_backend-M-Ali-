const userModel = require('../models/User');
const postModel = require("../models/Post");
const multer = require('multer');
const path = require('path');

// Set storage engine for Multer for profile images
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + "-" + file.originalname);
    }
});

// Check file type for profile images
function checkProfileFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Profile images only (JPEG, JPG, PNG)');
    }
}

// Initialize Multer upload for profile images
const uploadProfile = multer({
    storage: profileStorage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        console.log("req of profile", req);
        console.log("file of profile", file);
        console.log('Profile upload field:', file.fieldname); // Log the field name
        checkProfileFileType(file, cb);
    }
}).single('profile');

// Set storage engine for Multer for cover images
// const coverStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/covers/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, 'cover-' + Date.now() + "-" + file.originalname);
//     }
// });


// // Initialize Multer upload for cover images
// const uploadCover = multer({
//     storage: coverStorage,
//     limits: { fileSize: 10000000 }, // Limit file size to 10MB
//     fileFilter: function (req, file, cb) {
//         console.log("req of cover", req);
//         console.log("file of cover", file);
//         console.log('Cover upload field:', file.fieldname); // Log the field name
//         checkCoverFileType(file, cb);
//     }
// }).single('cover');

// Check file type for cover images
// function checkCoverFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Cover images only (JPEG, JPG, PNG)');
//     }
// }

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
                    cover: user.cover,
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

// Controller function for uploading user profile image - Step 3
exports.stepThree = async (req, res) => {
    uploadProfile(req, res, async (errProfile) => {
        try {
            // Check for Multer errors for profile image
            if (errProfile instanceof multer.MulterError) {
                console.log(errProfile);
                return res.status(400).json({
                    status: 400,
                    field: "profile",
                    error: 'Multer error: ' + errProfile.message
                });
            } else if (errProfile) {
                console.log(errProfile);
                return res.status(500).json({
                    status: 500,
                    field: "profile",
                    error: 'Internal server error: ' + errProfile
                });
            }

            // Check if profile image file is provided
            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: 'No profile image uploaded'
                });
            }

            // Get user ID from the authenticated user
            const userId = req.user.id;

            // Get profile image file path
            const profileImagePath = req.file.filename;

            // Update user record in the database with the profile image path
            const updatedUser = await userModel.updateUserFields(userId, {
                profile_picture: profileImagePath,
                is_active: 1
            }, "Step 3 completed! Your data have been updated you can now use all features.");

            res.status(200).json({
                status: 200,
                message: 'User profile image uploaded successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error uploading user profile image:', error.message);
            res.status(500).json({
                status: 500,
                error: `Internal server error: ${error.message}`
            });
        }
    });
};
