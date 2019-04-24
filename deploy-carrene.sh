#!/usr/bin/env bash

SERVER="carrene.com"
TARGET="$SERVER:/var/www/html/maestro"
npm install
npm run build
scp -rp dist/* $TARGET
