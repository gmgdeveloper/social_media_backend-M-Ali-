const postModel = require('../models/Post');
const multer = require('multer');
const path = require('path');
const env = require("dotenv")
env.config()

const baseUrl = process.env.BASE_URL || 'http://localhost';
const port = process.env.PORT || 8000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isImage = file.mimetype.startsWith('image');
        const isVideo = file.mimetype.startsWith('video');

        let destPath = './public/uploads/posts/';

        if (isImage) {
            destPath += 'images/';
        } else if (isVideo) {
            destPath += 'videos/';
        } else {
            destPath += 'others/';
        }

        cb(null, destPath);
    },
    filename: function (req, file, cb) {
        const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
        cb(null, file.fieldname + '-' + Date.now() + "-" + fileNameWithoutSpaces);
    }

});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('media', 15);

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|mp4/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and videos only (JPEG, JPG, PNG, MP4)');
    }
}

exports.createPost = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    status: 400,
                    error: err.message
                });
            }

            const user_id = req.user.id;
            const { caption } = req.body;
            let media = [];

            if (req.files && req.files.length > 0) {
                media = req.files.map(file => {
                    const mediaType = file.mimetype.startsWith('image') ? 'images' : 'videos';
                    return `${baseUrl}:${port}/uploads/posts/${mediaType}/${file.filename}`;
                });
            }

            if (!caption && media.length === 0) {
                return res.status(400).json({
                    status: 400,
                    error: 'Please provide caption or media'
                });
            }

            const newPost = await postModel.insertPost(user_id, caption, media);

            if (newPost.status === 200 || newPost.status === 201) {
                res.status(201).json({
                    status: 201,
                    message: 'Post created successfully',
                    post: newPost
                });
            } else {
                res.status(newPost.status).json({
                    status: newPost.status,
                    error: newPost.message
                });
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.getAllPostsWithUserData();
        res.status(200).json({
            status: posts.status || 200,
            message: posts.message || 'Posts fetched successfully',
            posts: posts.posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            status: 500,
            error: 'Internal server error'
        });
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postModel.getPostById(postId);

        if (!post) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        res.status(200).json({
            status: post.status || 200,
            message: post.message || 'Post fetched successfully',
            post: post.post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

exports.getPostsByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const posts = await postModel.getAllPostsByUserId(userId);

        if (!posts) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Posts fetched successfully',
            posts: posts
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};

exports.updatePostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        if (!req.user) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized: User not logged in'
            });
        }

        if (req.user.role === 'admin') {
            await updatePost();
        } else {
            const post = await postModel.getPostById(postId);

            if (!post || post.status === 404) {
                return res.status(404).json({
                    status: 404,
                    error: 'Post not found'
                });
            }

            if (post.post.user_id !== req.user.id) {
                return res.status(401).json({
                    status: 401,
                    error: 'Forbidden: You are unauthorized to edit this post'
                });
            }

            await updatePost();
        }

        async function updatePost() {
            upload(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    return res.status(400).json({
                        status: 400,
                        error: err.message
                    });
                }

                const { caption } = req.body;

                const updateFields = {};

                if (caption !== undefined && caption !== "") {
                    updateFields.caption = caption;
                }

                if (req.files && req.files.length > 0) {
                    updateFields.media = req.files.map(file => file.filename);
                } else if (req.file) {
                    updateFields.media = req.file.filename;
                }


                const updatedPost = await postModel.updatePost(postId, updateFields);

                if (updatedPost.status === 200) {
                    res.status(200).json({
                        status: 200,
                        message: 'Post updated successfully',
                        post: updatedPost.data
                    });
                } else {
                    res.status(updatedPost.status).json({
                        status: updatedPost.status,
                        error: updatedPost.message || 'Internal server error'
                    });
                }


            });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
}

exports.deletePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await postModel.getPostById(postId);

        if (!post) {
            return res.status(404).json({
                status: 404,
                error: 'Post not found'
            });
        }

        if (userRole === 'admin' && req.user.is_admin === 1) {
            const deleteResult = await postModel.deletePost(postId);
            if (deleteResult.status === 200) {
                return res.status(deleteResult.status).json({
                    status: deleteResult.status,
                    message: 'Post deleted successfully'
                });
            } else {
                return res.status(deleteResult.status).json({
                    status: deleteResult.status,
                    error: deleteResult.error || 'Internal server error'
                });
            }
        }

        console.log(post.post.user_id, "post user_id");
        console.log("userId", userId);
        console.log('post', post);

        if (post.post.user_id !== userId) { // Fixed typo here
            return res.status(401).json({
                status: 401,
                error: 'You are not authorized to delete this post'
            });
        }

        const deleteResult = await postModel.deletePost(postId);

        if (deleteResult.status === 200) {
            res.status(deleteResult.status).json({
                status: deleteResult.status || 200,
                message: deleteResult.message || 'Post deleted successfully'
            });
        } else {
            res.status(deleteResult.status).json({
                status: deleteResult.status,
                error: deleteResult.error || 'Internal server error'
            });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            status: 500,
            error: `Internal server error: ${error.message}`
        });
    }
};