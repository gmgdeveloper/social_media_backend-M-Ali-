const pool = require('../config/db');
const followModel = require('../models/followModel');

exports.getUserByField = async (fieldName, fieldValue) => {
    try {
        const query = `SELECT * FROM users WHERE ${fieldName} = ?`;

        const [rows] = await pool.query(query, [fieldValue]);

        return rows[0];

    } catch (error) {
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows || [];
    } catch (error) {
        console.error('Error fetching all users:', error);
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || 'Internal server error';
        throw { statusCode, errorMessage };
    }
};

exports.createUser = async ({ first_name, last_name, full_name, email, password, role, is_admin, profile_picture, cover_picture, bio }) => {
    try {
        const date = new Date();
        const options = {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };
        const currentDate = date.toLocaleString('en-US', options);

        const formattedDate = currentDate.replace(/ GMT\+\d{4} \(.*\)$/, '');

        const sql = `INSERT INTO users (first_name, last_name, full_name, email, password, role, is_admin, profile_picture,cover_picture, registration_date, bio)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        const [result] = await pool.query(sql, [first_name, last_name, full_name, email, password, role, is_admin, profile_picture, cover_picture, formattedDate, bio]);

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

exports.updateUserFields = async (id, fieldsToUpdate, successMsg) => {
    try {
        const setClause = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');
        const values = Object.values(fieldsToUpdate);
        const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
        const valuesWithId = [...values, id];

        const [result] = await pool.query(sql, valuesWithId);

        if (result.affectedRows < 1) {
            return { status: 404, message: 'User not found or data not updated' };
        }

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

exports.getSuggestedUsers = async (userId) => {
    try {
        // Get the list of followers and following for the given user
        const followers = await followModel.getFollowers(userId);
        const following = await followModel.getFollowing(userId);

        // Extract user IDs from followers and following lists
        const followerIds = followers.followers.map(follower => follower.id);
        const followingIds = following.following.map(following => following.id);

        // Find mutual followers by comparing the two lists
        const mutualFollowersIds = followerIds.filter(followerId => followingIds.includes(followerId));

        // Exclude the current user from the list of suggested users
        const suggestedUserIds = mutualFollowersIds.filter(id => id !== userId);

        // Get user details for suggested users
        const suggestedUsers = await userModel.getUsersByIds(suggestedUserIds);

        return { status: 200, suggestedUsers: suggestedUsers };
    } catch (error) {
        console.error('Error fetching suggested users:', error);
        return { status: 500, error: 'Internal server error' };
    }
};

exports.getUsersByIds = async (userIds) => {
    try {
        // Convert the array of user IDs into a comma-separated string
        const userIdsString = userIds.join(',');

        // Prepare the SQL query to fetch users by their IDs
        const sql = `
            SELECT id, full_name, profile_picture
            FROM users
            WHERE id IN (${userIdsString})
        `;

        // Execute the query
        const [rows] = await pool.query(sql);

        // Return the fetched users
        return rows;
    } catch (error) {
        console.error('Error fetching users by IDs:', error);
        throw new Error('Failed to fetch users by IDs');
    }
};
