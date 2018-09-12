#!/usr/bin/env bash

BRANCH=`git branch | grep \* | cut -d ' ' -f2`
if [ $BRANCH = "master" ]; then
  # FIXME: complete me
  TARGET=""
elif [ $BRANCH = "nightly" ]; then
  TARGET="shayan@192.168.1.85:/var/www/html/"
else
  echo "You can only deploy master and nightly branch"
  exit 1
fi
npm install
npm run build
scp -r dist/* $TARGET
