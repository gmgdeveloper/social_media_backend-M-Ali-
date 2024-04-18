const db = require('../config/db');

exports.uploadMedia = async (userId, description, mediaFiles) => {
    try {
        if (!userId) {
            return {
                status: 400,
                error: 'User ID is required'
            };
        }

        if ((!description || description.trim() === '') && (!mediaFiles || mediaFiles.length === 0)) {
            return {
                status: 400,
                error: 'No data provided to upload'
            };
        }

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

        let values = [userId];
        let sql = 'INSERT INTO gallery (user_id';

        if (description && description.trim() !== '') {
            sql += ', description';
            values.push(description);
        }

        if (mediaFiles && mediaFiles.length > 0) {
            mediaFiles.forEach(file => {
                const fieldName = file.mediaType === 'image' ? 'photo' : 'video';
                sql += `, ${fieldName}`;
                values.push(file.url);
            });
        }

        sql += ', created_at) VALUES (?';
        values.push(formattedDate);

        for (let i = 1; i < values.length; i++) {
            sql += ', ?';
        }
        sql += ')';

        console.log(sql);
        const [result] = await db.query(sql, values);

        if (result.affectedRows < 1) {
            return {
                status: 500,
                error: 'Failed to upload media'
            };
        }

        return {
            status: 201,
            message: 'Media uploaded successfully'
        };
    } catch (error) {
        console.error('Failed to upload media:', error);
        return {
            status: 500,
            error: `Failed to upload media: ${error.message}`
        };
    }
};
