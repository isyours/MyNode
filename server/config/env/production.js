'use strict';

/**
 * Expose
 */

module.exports = {
    dbStr: '127.0.0.1:27017/blogboost',
    db: 'mongodb://127.0.0.1:27017/blogboost',
    root: '',
    uploadPicPath: process.env.UPLOAD_FILE_PATH ||  'E:\\MyNode\\public\\img\\upload\\'
};
