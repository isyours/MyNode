var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogId: {type: String, unique: true},
    blogName: String,
    blogTitle: {type: String, unique: true},
    blogBrief: String,
    blogContent: String,
    blogMarkdownContent: String,
    blogTags: [String],
    blogBackground: String,
    createTime: Date,
    updateTime: Date
}, {collection: 'blogs'});

module.exports = mongoose.model('Blog', blogSchema);