/**
 * Created by chenhaolong on 2017/4/1.
 */

var mongoose = require('mongoose');

var visitorInfo = new mongoose.Schema({
    infoId: {type: String, unique: true},
    visitorIp: String,
    createTime: Date,
    action: String,
    detailActions: Object
}, {collection: 'visitorInfo'});

module.exports = mongoose.model('VisitorInfo', visitorInfo);
