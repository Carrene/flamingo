#!/usr/bin/env bash

BRANCH=`git branch | grep \* | cut -d ' ' -f2`
if [ $BRANCH = "master" ]; then
  TARGET=""
elif [ $BRANCH = "nightly" ]; then
  TARGET=""
else
  echo "You can only deploy master and nightly branch"
  exit 1
fi
npm install
npm run build
scp -r dist/* $TARGET
