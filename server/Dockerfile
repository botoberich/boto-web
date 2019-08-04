FROM node:alpine
WORKDIR /usr/app
COPY . .
RUN apk add build-base \
    && npm i
CMD ["npm", "start"]