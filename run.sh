#!/bin/bash
ps -ef | grep "/home/web/myblog/MyNode/node_modules/babel/lib/_babel-node" | grep -v grep | awk '{print $2}' | xargs kill -9
mv running.log running.log.$(date +%Y%m%d%H)
/usr/bin/nodejs /home/web/myblog/MyNode/node_modules/babel/lib/_babel-node server.js >> running.log&
