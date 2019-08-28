import express, { Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setup } from 'radiks-server';
import { authenticate } from './middlewares/auth';
import { IResponse } from './interfaces/response.interface';

const app = express();
const PORT = process.env.PORT || (process.env.DEBUG ? 4001 : 3000);
const BASE_PATH = `user/photos`;

app.use(
    cors(),
    bodyParser.json({
        limit: '50mb',
    })
);

app.use(authenticate);

app.use('/thumbnail/:id', async (req, res: IResponse, next) => {
    let data = await res.blockstack.getFile(`${BASE_PATH}/${req.params.id}/thumbnail`);
    res.json(JSON.parse(data.toString()));
});

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

    const RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    console.log(`Successfully connected to the '${process.env.APP_ENV}' mongodb instance.`);

    app.use('/radiks', RadiksController);
});
