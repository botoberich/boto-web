FROM node:alpine
WORKDIR /usr/app
COPY . .
RUN apk add build-base gcc python2 \
    && npm i
CMD ["npm", "start"]