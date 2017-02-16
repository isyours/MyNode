var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    blogId: String,
    blogName: String,
    blogTitle: String,
    blogContent: String,
    createTime: Date,
    updateTime: Date
}, {collection: 'blogs'});

module.exports = mongoose.model('Blog', blogSchema);