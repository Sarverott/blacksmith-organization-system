#!/usr/bin/env bash
cd ~/Workshop/forge
mkdir "$1.git"
cd "$1.git"
git init --bare
exit
