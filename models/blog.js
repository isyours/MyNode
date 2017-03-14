var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogId: String,
    blogName: String,
    blogTitle: String,
    blogContent: String,
    blogMarkdownContent: String,
    blogTags: [String],
    blogBackground: String,
    createTime: Date,
    updateTime: Date
}, {collection: 'blogs'});

module.exports = mongoose.model('Blog', blogSchema);