#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push

cd -
