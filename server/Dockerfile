FROM node:alpine
WORKDIR /usr/app/server
COPY . .
RUN apk add build-base gcc python2 \
    && npm i \
    && npm run build
CMD ["npm", "start"]