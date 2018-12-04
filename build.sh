#!/usr/local/bin/fish
docker-compose build mongo
docker-compose create mongo
docker-compose start mongo
docker run -d --mount type=bind,source=$PWD/data/bin,destination=/data/bin mongo
docker-compose build app
docker-compose create app
docker-compose start app
