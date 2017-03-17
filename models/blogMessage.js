/**
 * Created by chenhaolong on 2017/3/17.
 */

var mongoose = require('mongoose');

var blogMessageSchema = new mongoose.Schema({
    messageId: {type: String, unique: true},
    blogId: String,
    userName: String,
    userIp: String,
    email: String,
    messageContent: String,
    createTime: Date
}, {collection: 'blogMessage'});

module.exports = mongoose.model('BlogMessage', blogMessageSchema);
