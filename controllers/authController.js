const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/User');
const sendMail = require("../helpers/sendMail")
const generateToken = require("../helpers/generateToken")
const Joi = require('joi');
const env = require("dotenv")
env.config();

const registerSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required'
        }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm Password must match Password',
        'any.required': 'Confirm Password is required'
    }),
}).options({ abortEarly: false });


const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'You must provide an email',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().min(8).required()
});

const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm Password must match New Password',
        'any.required': 'Confirm Password is required'
    }),
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.pattern.base': 'New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
            'string.min': 'New password must be at least 8 characters long',
            'any.required': 'New password is required'
        }),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm new password must match new password',
        'any.required': 'Confirm new password is required'
    }),
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

            const token = jwt.sign(payload, process.env.JWT_SECRET);

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
            cover_picture: user.cover_picture,
            role: user.role,
            is_admin: user.is_admin,
            is_active: user.is_active,
            registration_date: user.registration_date
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);

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

exports.forgetPassword = async (req, res) => {
    try {
        const { error } = forgetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                error: error.details[0].message
            });
        }

        const { email } = req.body;

        const user = await userModel.getUserByField("email", email);
        if (!user) {
            return res.status(401).json({
                status: 401,
                error: 'Invalid email!'
            });
        }

        const resetToken = generateToken(20);

        const updateUserResult = await userModel.updateUserFields(user.id, { reset_token: resetToken }, 'Reset token generated successfully');

        if (updateUserResult.status !== 200) {
            return res.status(updateUserResult.status).json({
                status: updateUserResult.status,
                error: updateUserResult.message
            });
        }

        const resetLink = `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/reset-password`;

        const message = `Hello ${user.first_name},\n\nYou have requested to reset your password. Please follow this link to reset your password: ${resetLink}`;

        try {
            const mail = await sendMail(user.email, 'Password Reset Request', message);

            if (mail.status === 200) {
                return res.status(200).json({
                    status: 200,
                    message: 'Password reset email sent successfully',
                    resetToken: resetToken
                });
            } else {
                await userModel.updateUserFields(user.id, { reset_token: null }, 'Reset token cleared');
                return res.status(500).json({
                    status: 500,
                    error: 'Error sending password reset email'
                });
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            await userModel.updateUserFields(user.id, { reset_token: null }, 'Reset token cleared');
            return res.status(500).json({
                status: 500,
                error: 'Error sending password reset email'
            });
        }

    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { error, value } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 400,
                error: error.details[0].message
            });
        }
        const token = req.header('resetToken')
        const { newPassword, confirmNewPassword } = value;

        const user = await userModel.getUserByField("reset_token", token);

        if (!user) {
            return res.status(400).json({
                status: 400,
                error: 'Invalid reset token!'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                status: 400,
                error: 'Passwords do not match!'
            });
        }

        const oldPassCheck = await bcrypt.compare(newPassword, user.password);
        if (oldPassCheck) {
            return res.status(400).json({
                status: 400,
                error: 'New password cannot be the same as the old password!',
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateUserResult = await userModel.updateUserFields(user.id, { password: hashedPassword, reset_token: null }, 'Password reset successfully');

        if (updateUserResult.status === 200) {
            const msg = `Hello ${user.first_name},\n\nYour password has been reset successfully.`;
            const subject = 'Password Reset Confirmation';
            try {
                const mail = await sendMail(user.email, subject, msg);
                return res.status(mail.status || 200).json({
                    status: mail.status || 200,
                    message: 'Password reset successfully'
                });
            } catch (error) {
                console.error('Error sending password reset email:', error);
                const err = await userModel.updateUserFields(user.id, { reset_token: null }, 'Reset token cleared');
                return res.status(500).json({
                    status: 500,
                    error: 'Error sending password reset email',
                    err: err
                });
            }
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { error, value } = changePasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, error: error.details[0].message });
        }

        const userId = req.user.id;

        const { oldPassword, newPassword } = value;

        const user = await userModel.getUserByField("id", userId);
        if (!user) {
            return res.status(404).json({ status: 404, error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: 401, error: 'Incorrect old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await userModel.updateUserFields(userId, { password: hashedNewPassword }, 'Password changed successfully');

        if (updatedUser.status === 200) {
            try {
                const message = `Hello ${user.first_name},\n\nYour password has been changed successfully.`;
                const subject = 'Password Change Notification';
                await sendMail(user.email, subject, message);
            } catch (emailError) {
                console.error('Error sending password change email:', emailError);
                err = {
                    status: 500,
                    message: `Password has been changed successfully.`,
                    error: `Couldn't send email because of an internal server error.`
                }
                return err
            }
            return res.status(200).json({
                status: 200,
                message: 'Password changed successfully'
            });
        } else {
            err = {
                status: updatedUser.status,
                message: updatedUser.message,
                error: updatedUser.error
            }
            return err
        }

    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};
