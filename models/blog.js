var mongoose = require('mongoose');

global.blogTypeMapping = {
    tech: 1,
    food: 2,
    religion: 3,
    life: 4
};

var blogSchema = new mongoose.Schema({
    blogId: {type: String, unique: true},
    blogName: String,
    blogTitle: {type: String, unique: true},
    blogBrief: String,
    blogContent: String,
    blogMarkdownContent: String,
    blogTags: [String],
    blogBackground: String,
    blogType: Number,
    createTime: Date,
    updateTime: Date
}, {collection: 'blogs'});

module.exports = mongoose.model('Blog', blogSchema);