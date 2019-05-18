#!/bin/sh

printf "\n\n"

date
forever start -a -o ./logs/log.txt app.js
#nohup node app.js

printf "\n\n"
