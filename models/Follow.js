const pool = require('../config/db');

exports.followUser = async (followerId, followingId) => {
    try {
        const date = new Date();
        const followDate = date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).replace(/ GMT\+\d{4} \(.*\)$/, '');
        const sql = 'INSERT INTO followers (follower_id, following_id, follow_date) VALUES (?, ?, ?)';
        await pool.query(sql, [followerId, followingId, followDate]);
        return { status: 201, message: 'User followed successfully' };
    } catch (error) {
        console.error('Error following user:', error);
        return { status: 500, error: error.message };
    }
};

exports.unfollowUser = async (followerId, followingId) => {
    try {
        const sql = 'DELETE FROM followers WHERE follower_id = ? AND following_id = ?';
        const [result] = await pool.query(sql, [followerId, followingId]);

        if (result.affectedRows > 0) {
            return { status: 200, message: 'User unfollowed successfully' };
        } else {
            return { status: 404, message: 'User was not found or not previously followed' };
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return { status: 500, error: error.message };
    }
};

exports.getFollowers = async (userId) => {
    try {
        if (!userId) {
            return { status: 400, error: 'User ID is missing' };
        }

        const sql = `
            SELECT users.id, users.full_name, users.profile_picture, followers.follow_date
            FROM users
            INNER JOIN followers ON users.id = followers.follower_id
            WHERE followers.following_id = ? ORDER BY followers.follow_id DESC`;
        const [rows] = await pool.query(sql, [userId]);
        return { status: 200, followers: rows };
    } catch (error) {
        console.error('Error retrieving followers:', error);
        return { status: 500, error: 'Internal server error' };
    }
};

exports.getFollowing = async (userId) => {
    try {
        if (!userId) {
            return { status: 400, error: 'User ID is missing' };
        }

        const sql = `
            SELECT users.id, users.full_name, users.profile_picture, followers.follow_date
            FROM users
            INNER JOIN followers ON users.id = followers.following_id
            WHERE followers.follower_id = ? 
            order by followers.follow_id desc
            `;
        const [rows] = await pool.query(sql, [userId]);
        return { status: 200, following: rows };
    } catch (error) {
        console.error('Error retrieving following:', error);
        return { status: 500, error: 'Internal server error' };
    }
};


exports.getFollowStatus = async (followerId, followingId) => {
    try {
        const sql = 'SELECT COUNT(*) AS count FROM followers WHERE follower_id = ? AND following_id = ?';
        const [rows] = await pool.query(sql, [followerId, followingId]);
        return rows[0].count > 0;
    } catch (error) {
        console.error('Error checking follow status:', error);
        throw new Error('Failed to check follow status');
    }
};

// Function to fetch all friends (mutual connections) of a user
exports.getAllFriends = async (userId) => {
    try {
        if (!userId) {
            return { status: 400, error: 'User ID is missing' };
        }

        const sql = `
            SELECT users.id, users.full_name, users.profile_picture
            FROM users
            INNER JOIN followers AS f1 ON users.id = f1.following_id
            INNER JOIN followers AS f2 ON users.id = f2.follower_id
            WHERE f1.follower_id = ? AND f2.following_id = ?
        `;

        const [rows] = await pool.query(sql, [userId, userId]);

        if (!rows || rows.length === 0) {
            return { status: 404, error: 'No friends found for the user', friends: [] };
        }

        return { status: 200, friends: rows };
    } catch (error) {
        console.error('Error fetching friends:', error);
        return { status: 500, error: 'Internal server error' };
    }
};
