import express from 'express';
import bodyParser from 'body-parser';
import NodeCache from 'node-cache';
import cors from 'cors';
import { setup } from 'radiks-server';

const app = express();
const PORT = process.env.PORT || (process.env.DEBUG ? 4001 : 4000);
const Cache = new NodeCache();

app.use(
    cors(),
    bodyParser.json({
        limit: '50mb',
    })
);

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

app.use('/get/:id', (req, res) => {
    let cache = Cache.get(req.params.id);
    res.json({ status: 'success', cache });
});

app.post('/set', (req, res) => {
    Cache.set(req.body.id, req.body.cache);
    res.json({ status: 'success' });
});

app.listen(PORT, async () => {
    console.log(`Express server is listening on ${PORT}!`);

    let RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    app.use('/radiks', RadiksController);
});
