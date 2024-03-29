// Import necessary modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Changed require statement
const userModel = require('../models/User'); // Import user model
const Joi = require('joi');
const env = require("dotenv")
env.config(); // Load environment variables

// Define a custom validator function to check if a string is all lowercase
const isLowerCase = (value, helpers) => {
    if (value === value.toLowerCase()) {
        return value; // If the value is all lowercase, return it
    } else {
        return helpers.error('any.lowercase');
    }
};

// Define Joi schema for user registration
const registerSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm Password must match Password',
        'any.required': 'Confirm Password is required'
    }),
    // bio: Joi.string().allow('').optional()
});


// Define Joi schema for user login
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'You must provide an email',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().min(8).required()
});

const activeSessions = {}; // Object to store active session tokens

// Controller function for user registration
exports.register = async (req, res) => {
    // Validate request body against the schema
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // Return validation error message
        return res.status(400).json({
            status: 400,
            error: error.details[0].message
        });
    }

    // Destructure necessary data from the request body
    const { first_name, last_name, email, password } = req.body;

    // Set default values for role and is_admin
    const full_name = first_name + " " + last_name
    const role = 'user';
    const is_admin = 0;

    // Generate username using current timestamp
    const username = `user-${Date.now()}`;

    // Generate bio with default message
    const bio = `Hi there, I'm ${full_name}, I created this account on ${new Date().toDateString()}`;

    // Set default profile picture
    const profile_picture = "default.png";

    try {
        // Check if the user already exists by email
        const existingEmail = await userModel.getUserByField("email", email);
        if (existingEmail) {
            return res.status(400).json({
                status: 400,
                error: 'User with that email already exists'
            });
        }

        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with default values for other columns
        const newUser = await userModel.createUser({
            first_name,
            last_name,
            full_name,
            email,
            password: hashedPassword,
            role,
            is_admin,
            profile_picture,
            username,
            bio
        });

        // Generate JWT token for the new user
        const payload = {
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            full_name: newUser.full_name,
            email: newUser.email,
            bio: newUser.bio,
            username: newUser.username,
            profile_picture: newUser.profile_picture,
            role: newUser.role,
            is_admin: newUser.is_admin
        };

        // Sign JWT token with secret key and expiration time
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

        // Set token and user_id in the response headers
        res.setHeader('Authorization', `${token}`);

        // Send success response with user data
        res.status(201).json({
            status: 200,
            message: 'User registered successfully',
            token: token,
            user: payload
        });

    } catch (error) {
        console.error('Error registering user:', error);
        // Send error response in case of any internal error
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
}

// Controller function for login
exports.login = async (req, res) => {
    // Validate request body against the schema
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            error: error.details[0].message
        });
    }

    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await userModel.getUserByField("email", email);
        if (!user) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid email!'
            });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid password!'
            });
        }

        // Invalidate previous session if exists
        if (activeSessions[user.id]) {
            delete activeSessions[user.id]; // Invalidate previous session
        }

        // Generate JWT token for the user
        const payload = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            email: user.email,
            bio: user.bio,
            username: user.username,
            profile_picture: user.profile_picture,
            role: user.role,
            is_admin: user.is_admin
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

        // Save session token in activeSessions
        activeSessions[user.id] = token;

        // Set token in the response headers
        res.setHeader('Authorization', `${token}`)

        // Send success response without including token in the body
        res.status(200).json({
            status: 200,
            message: 'Login successful.',
            token: token,
            user: payload
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
};



// Controller function for user logout 
exports.logout = async (req, res) => {
    try {
        // Clear token from headers or cookies or wherever it's stored 
        // For example, if you're using JWT in headers 
        res.setHeader('Authorization', '');
        res.status(200).json({
            status: 200,
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
};
