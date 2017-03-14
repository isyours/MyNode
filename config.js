/*
 * Copyright (C) 2017 Baidu, Inc. All Rights Reserved.
 */
module.exports = {
  database: process.env.MONGO_URI || '127.0.0.1:27017/blogboost',
  uploadPicPath: process.env.UPLOAD_FILE_PATH || './public/img/upload/'
};