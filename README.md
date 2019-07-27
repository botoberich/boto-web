# Getting started

Database setup

-   [Install mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition-with-homebrew)
-   Create a mongo database called 'radiks-server'
-   Create a collection called 'radiks-server-data'
-   Create a .env file inside `/server` with content
    `MONGODB_URL='mongodb://localhost:27017/radiks-server'` (Note: you may have a different connection string)

Run radiks server

-   `cd server && npm run start:dev`

Run frontend

-   `cd web && npm run develop`

# Helpful resources

[Blockstack.js](https://blockstack.github.io/blockstack.js/index.html)

[Radiks.js](https://github.com/blockstack-radiks/radiks)

[Radiks server](https://github.com/blockstack-radiks/radiks-server)
