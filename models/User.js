// models/userModel.js

// Import the database connection
const pool = require('../config/db');

// Function to fetch user by feilds from the database
exports.getUserByField = async (fieldName, fieldValue) => {
    try {
        const query = `SELECT * FROM users WHERE ${fieldName} = ?`;

        const [rows] = await pool.query(query, [fieldValue]);

        return rows[0];

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
exports.createUser = async ({ first_name, last_name, full_name, email, password, role, is_admin, profile_picture, cover_picture, bio }) => {
    try {

        const date = new Date()
        const currentDate = `${date}`

        const sql = `INSERT INTO users (first_name, last_name, full_name, email, password, role, is_admin, profile_picture,cover_picture, registration_date, bio)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        const [result] = await pool.query(sql, [first_name, last_name, full_name, email, password, role, is_admin, profile_picture, cover_picture, currentDate, bio]);

        const user = await this.getUserByField("id", result.insertId)

        if (user) {
            const success = {
                status: 201,
                message: "User created successfully!",
                data: user
            }
            return success
        } else {
            const err_obj = {
                status: 404,
                message: "Something went wrong!"
            }
            return err_obj
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

// Function to update user's data by provided fields in the database
exports.updateUserFields = async (id, fieldsToUpdate, successMsg) => {
    try {
        // Generate SQL SET clause dynamically based on the fields to update
        const setClause = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');
        // console.log("Set Clause:", setClause);
        const values = Object.values(fieldsToUpdate);
        // console.log("values", values);
        const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
        // console.log("sql", sql);
        const valuesWithId = [...values, id];
        // console.log("valuesWithId", valuesWithId);

        const [result] = await pool.query(sql, valuesWithId);

        // Check if the update was successful
        if (result.affectedRows < 1) {
            return { status: 404, message: 'User not found or data not updated' };
        }

        // Fetch and return the updated user
        const updatedUser = await this.getUserByField("id", id);
        if (!updatedUser) {
            return { status: 404, message: 'User not found after update' };
        } else {
            success = {
                status: 200,
                message: successMsg,
                data: updatedUser
            }
            return success
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: `Internal server error: ${error.message}` };
    }
};