const express = require('express');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
const cors = require('cors');
const { setup } = require('radiks-server');

const app = express();
const PORT = process.env.DEBUG ? 4001 : 4000;
const Cache = new NodeCache();

const whitelist = ['http://boto.photos', 'https://boto.photos'];
const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(
    cors(corsOptions),
    bodyParser.json({
        limit: '50mb',
    })
);
app.use('/get/:id', (req, res) => {
    let cache = Cache.get(req.params.id);
    res.json({ status: 'success', cache });
});
app.post('/set', (req, res) => {
    Cache.set(req.body.id, req.body.cache);
    res.json({ status: 'success' });
});
app.listen(PORT, async () => {
    console.log(`EXPRESS SERVER LISTENING ON PORT ${PORT}!`);

    let RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    app.use('/radiks', RadiksController);
});
