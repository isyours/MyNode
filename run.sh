#!/bin/bash
git pull
gulp build
forever start -a -l $LOG/forever.log -o $LOG/out.log -e $LOG/err.log $BLOG_HOME/server.js
