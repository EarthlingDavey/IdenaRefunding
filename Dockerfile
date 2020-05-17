FROM node:12

# Create app directory
WORKDIR /usr/src/app


RUN yarn global add nodemon

COPY ./docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]