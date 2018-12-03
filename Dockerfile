FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY ./myweb/package.json /usr/src/app

RUN yarn \
&& mkdir /usr/src/logs

COPY ./myweb/ /usr/src/app/

EXPOSE 3000

ENTRYPOINT ["./entry.sh"]
FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY ./myweb/package.json /usr/src/app

RUN yarn \
&& mkdir /usr/src/logs

COPY ./myweb/ /usr/src/app/

EXPOSE 3000

ENTRYPOINT ["./entry.sh"]
