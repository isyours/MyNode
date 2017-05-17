#!/usr/bin/env bash
forever start -a --pidFile $BLOG_HOME/pid.file -l $LOG/forever.log -o $LOG/out.log -e $LOG/err.log $BLOG_HOME/server.js