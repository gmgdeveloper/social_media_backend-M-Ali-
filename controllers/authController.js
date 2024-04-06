const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/User');
const Joi = require('joi');
const env = require("dotenv")
env.config();


const registerSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm Password must match Password',
        'any.required': 'Confirm Password is required'
    }),
});


const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'You must provide an email',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().min(8).required()
});

const activeSessions = {};

exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            error: error.details[0].message
        });
    }

    const { first_name, last_name, email, password } = req.body;

    const full_name = first_name + " " + last_name
    const role = 'user';
    const is_admin = 0;

    const bio = `Hi there, I'm ${full_name}, I created this account on ${new Date().toDateString()}`;

    const profile_picture = "default.jpg";
    const cover_picture = "default.jpg";

    try {
        const existingEmail = await userModel.getUserByField("email", email);
        if (existingEmail) {
            return res.status(400).json({
                status: 400,
                error: 'User with that email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.createUser({
            first_name,
            last_name,
            full_name,
            email,
            password: hashedPassword,
            role,
            is_admin,
            profile_picture,
            cover_picture,
            bio
        });

        if (newUser.status === 201 || newUser.status === 200) {
            const payload = {
                id: newUser.data.id,
                first_name: newUser.data.first_name,
                last_name: newUser.data.last_name,
                full_name: newUser.data.full_name,
                email: newUser.data.email,
                bio: newUser.data.bio,
                profile_picture: newUser.data.profile_picture,
                cover_picture: newUser.data.cover_picture,
                role: newUser.data.role,
                is_admin: newUser.data.is_admin,
                is_active: newUser.data.is_active,
                registration_date: newUser.data.registration_date
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

            res.setHeader('Authorization', `${token}`);

            res.status(201).json({
                status: 200,
                message: 'User registered successfully',
                user: payload,
                token: token
            });
        } else {
            res.status(newUser.status).json({
                status: newUser.status,
                error: newUser.message
            });
        }

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
}

exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            error: error.details[0].message
        });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByField("email", email);
        if (!user) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid email!'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid password!'
            });
        }
        if (activeSessions[user.id]) {
            delete activeSessions[user.id];
        }

        const payload = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            email: user.email,
            bio: user.bio,
            profile_picture: user.profile_picture,
            role: user.role,
            is_admin: user.is_admin,
            is_active: user.is_active,
            registration_date: user.registration_date
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

        activeSessions[user.id] = token;
        res.setHeader('Authorization', `${token}`)

        res.status(200).json({
            status: 200,
            message: 'Login successful.',
            user: payload,
            token: token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
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
