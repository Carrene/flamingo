#!/usr/bin/env bash

BRANCH=`git branch | grep \* | cut -d ' ' -f2`
REGEX="release/[[:digit:]]"
SERVER="carrene.com"
TARGET="$SERVER:/var/www/html/maestro"
npm install
npm run build
scp -rp dist/* $TARGET
#ssh $SERVER "chgrp -R www-data /var/www/html/maestro/*"

