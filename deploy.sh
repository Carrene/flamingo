#!/usr/bin/env bash

BRANCH=`git branch | grep \* | cut -d ' ' -f2`
REGEX="release\/\d"
if [ $BRANCH = "master" ]; then
  # FIXME: complete me
  SERVER=""
  TARGET=""
elif [ $BRANCH = "nightly" ]; then
  SERVER="192.168.1.85"
  TARGET="$SERVER:/var/www/html/maestro"
elif [ $BRANCH =~ $REGEX ]; then
  SERVER="192.168.1.85"
  TARGET="$SERVER:/var/www/html/maestro"
else
  echo "You can only deploy master and nightly branch"
  exit 1
fi
npm install
npm run build
scp -rp dist/* $TARGET
ssh $SERVER "chgrp -R www-data /var/www/html/maestro/*"
