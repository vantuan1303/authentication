#!/usr/local/bin/fish
docker stop authentication
docker rm authentication
docker build -t authentication .
docker run --name authentication -d -p 80:3000 authentication
sleep 1
curl http://localhost