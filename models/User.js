// models/userModel.js

// Import the database connection
const pool = require('../config/db');


// Function to fetch user by feilds from the database
exports.getUserByField = async (fieldName, fieldValue) => {
    try {
        // Construct the SQL query dynamically based on the field provided
        const query = `SELECT * FROM users WHERE ${fieldName} = ?`;

        const [rows] = await pool.query(query, [fieldValue]);
        return rows[0]; // Assuming there's only one matching user
    } catch (error) {
        throw error;
    }
};

// Function to fetch all users from the database
exports.getAllUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows || []; // Return an empty array if no users found
    } catch (error) {
        console.error('Error fetching all users:', error);
        const statusCode = error.statusCode || 500; // Default to 500 if statusCode is not provided
        const errorMessage = error.message || 'Internal server error'; // Default to 'Internal server error' if message is not provided
        throw { statusCode, errorMessage };
    }
};


// Function to create a new user in the database
exports.createUser = async ({ first_name, last_name, full_name, email, password, role, is_admin, profile_picture, username, bio }) => {
    try {

        const sql = `INSERT INTO users (first_name, last_name, full_name, email, password, role, is_admin, profile_picture, registration_date, username, bio)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        const [result] = await pool.query(sql, [first_name, last_name, full_name, email, password, role, is_admin, profile_picture, new Date(), username, bio]);
        const user = this.getUserByField("id", result.insertId)
        return user;
    } catch (error) {
        console.log(error);
        const err_obj = {
            status: 500,
            message: error.message
        }
        return err_obj
    }
};

// Function to update user's bio in the database
exports.updateUserBio = async (id, bio) => {
    try {
        const sql = `UPDATE users SET bio =? WHERE id =?`;
        const [result] = await pool.query(sql, [bio, id]);
        const user = await this.getUserByField("id", id)
        console.log("result variable: ", result);
        if (!result) {


            const err_obj = {
                status: 404,
                message: "Something went wrong!"
            }
            return err_obj
        } else {
            console.log("user variable: ", user);
            if (!user) {
                const errObj = {
                    status: 404,
                    message: "Could not retrieve data!"
                }
                return errObj
            } else {
                return user || [];
            }
        }
    } catch (error) {
        console.log(error);
        const err_obj = {
            status: 500,
            message: error.message
        }
        return err_obj
    }
};

// Function to update user's profile picture in the database
exports.updateUserProfilePic = async (userId, filePath) => {
    try {
        // Define SQL query to update user's profile picture
        const sql = 'UPDATE users SET profile_picture = ? WHERE id = ?';

        // Execute SQL query to update user's profile picture
        const [result] = await pool.query(sql, [filePath, userId]);

        // Check if any rows were affected by the update
        if (result.affectedRows === 0) {
            // If no rows were affected, throw an error indicating that the user was not found
            throw new Error('User not found');
        }

        // Fetch and return the updated user by their ID
        const updatedUser = await this.getUserByField('id', userId);
        return updatedUser;
    } catch (error) {
        // Catch any errors that occur during the update process and rethrow them
        throw new Error(error.message);
    }
};
