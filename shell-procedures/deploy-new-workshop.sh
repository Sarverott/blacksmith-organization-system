#!/usr/bin/env bash
bosdirpath=$(pwd)
cd ~
mkdir Workshop Workshop/forge Workshop/archive Workshop/notes Workshop/config
cd Workshop
touch bos-workshop.log
echo "HELLO_WORLD= new BlacksmithOrganisationSystem Workshop created" > ./bos-workshop.log
echo "CREATE_TIME=$(date)" >> ./bos-workshop.log
echo "CREATE_BASE=$bosdirpath" >> ./bos-workshop.log
cat ./bos-workshop.log
git clone -l --no-hardlinks "$bosdirpath"
cd blacksmith-organisation-system
cp start-cli-interface.sh ../RUN
cd ..
chmod 511 ./RUN
./RUN
echo Programm ends at $(date)
exit
