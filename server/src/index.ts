const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setup } = require('radiks-server');

const app = express();
const PORT = process.env.PORT || (process.env.DEBUG ? 4001 : 3000);

app.use(
    cors(),
    bodyParser.json({
        limit: '50mb',
    })
);

app.use((req, res, next) => {
    console.log('VERIFY TOKEN MIDDLEWARE');
    console.log(req.headers);
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({ ['March to Web3']: 'Alive' });
});

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

app.listen(PORT, async () => {
    console.log(`Successfully started '${process.env.APP_ENV}' server on port ${PORT}!`);

    let RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    console.log(`Successfully connected to the '${process.env.APP_ENV}' mongodb instance.`);

    app.use('/radiks', RadiksController);
});
