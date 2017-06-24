#!/bin/bash
cd /home/web/myblog/MyNode
git pull
bower install
npm install
gulp build
