const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setup } = require('radiks-server');

const app = express();
const PORT = process.env.SERVER_PORT || (process.env.DEBUG ? 4001 : 3000);
console.log('ENVS: ', JSON.stringify(process.env));
console.log('MONGO URL: ', process.env.MONGODB_URL);
console.log('PORT: ', process.env.SERVER_PORT);
app.use(
    cors(),
    bodyParser.json({
        limit: '50mb',
    })
);

app.get('/', (req, res) => {
    res.status(200).json({ ['March to Web3']: 'Alive' });
});

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

app.listen(PORT, async () => {
    console.log(`Express server is listening on ${PORT}!`);

    let RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    app.use('/radiks', RadiksController);
});
