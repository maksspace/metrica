#!/bin/sh

pm2 start --name "frontend" "serve -p 3000 -s ./frontend"
pm2 start --name "backend" "cd ./backend && yarn start"

pm2 logs -f