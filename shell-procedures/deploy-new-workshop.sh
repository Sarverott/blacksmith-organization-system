#!/usr/bin/env bash

mkdir ~/Workshop ~/Workshop/forge ~/Workshop/archive ~/Workshop/notes ~/Workshop/config
touch ~/Workshop/bos-workshop.log
echo "HELLO_WORLD= new BlacksmithOrganisationSystem Workshop created" > ~/Workshop/bos-workshop.log
echo "CREATE_TIME=$(date)" >> ~/Workshop/bos-workshop.log
bosdirpath=$(pwd)
echo "CREATE_BASE=$bosdirpath" >> ~/Workshop/bos-workshop.log
cat ~/Workshop/bos-workshop.log
cd ~/Workshop
git clone -l --no-hardlinks "$bosdirpath"
cp ./blacksmith-organization-system/shell-procedures/start-cli-interface.sh ./RUN
chmod 511 ./RUN
./RUN
exit
