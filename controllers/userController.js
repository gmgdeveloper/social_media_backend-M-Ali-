const userModel = require('../models/User');
const multer = require('multer');
const path = require('path');


// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname);
    }
});

// Initialize Multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profile'); // 'avatar' should match the name attribute in the form input field for uploading the image

// Check file type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png/;
    // Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only (JPEG, JPG, PNG)');
    }
}

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
                    registration_date: user.registration_date
                }
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
    const { bio, username } = req.body;

    if (!bio) {
        return res.status(400).json({
            status: 400,
            error: 'Please provide a bio!'
        });
    }
    if (!username) {
        return res.status(400).json({
            status: 400,
            error: 'Please provide a username!'
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
        const updatedUser = await userModel.updateUserFields(id, { bio, username });

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


// Controller function for uploading user image
exports.uploadUserProfilePic = async (req, res) => {
    upload(req, res, async (err) => {
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
                    error: 'Internal server error: ' + err.message
                });
            }

            // Check if file is provided
            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    error: 'No file uploaded'
                });
            }

            // Get user ID from the authenticated user
            const userId = req.user.id; // Assuming req.user contains authenticated user data

            // Get file path
            const filePath = req.file.path;

            // Update user record in the database with the file path
            const updatedUser = await userModel.updateUserProfilePic(userId, filePath);

            res.status(200).json({
                status: 200,
                message: 'User image uploaded successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error uploading user image:', error.message);
            res.status(500).json({
                status: 500,
                error: `Internal server error: ${error.message}`
            });
        }
    });
};