#!/usr/local/bin/fish
docker-compose build mongo
docker-compose create mongo
docker-compose start mongo
docker-compose build app
docker-compose create app
docker-compose start app
