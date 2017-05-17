#!/bin/bash
ps -ef | grep "forever/bin/monitor" | grep -v grep | awk '{print $2}' | xargs kill -9
forever start -l $LOG/forever.log -o $LOG/out.log -e $LOG/err.log server.js