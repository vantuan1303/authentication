
FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY ./authentication/package.json /usr/src/app/

RUN yarn \
&& mkdir /usr/src/logs

COPY ./authentication/ /usr/src/app/

EXPOSE 3000

ENTRYPOINT ["./entry.sh"]