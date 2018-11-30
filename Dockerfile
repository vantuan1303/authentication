
FROM mhart/alpine-node:latest

WORKDIR /usr/src/nodeapp

COPY ./authentication/package.json /usr/src/nodeapp/

RUN yarn \
&& mkdir /usr/src/logs

COPY ./authentication/ /usr/src/nodeapp/

EXPOSE 3000

ENTRYPOINT ["./entry.sh"]