import express, { Response, Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setup } from 'radiks-server';
import { authenticate } from './middlewares/auth';
import { IResponse } from './interfaces/http.interface';

const app = express();
const router = Router();
const PORT = process.env.PORT || (process.env.DEBUG ? 4001 : 3000);

app.use(
    cors(),
    bodyParser.json({
        limit: '50mb',
    })
);

app.use(authenticate);
app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

router.use('/gaia', require('./routes/gaia'));
app.use(router);
app.listen(PORT, async () => {
    console.log(`Successfully started '${process.env.APP_ENV}' server on port ${PORT}!`);

    const RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    console.log(`Successfully connected to the '${process.env.APP_ENV}' mongodb instance.`);

    app.use('/radiks', RadiksController);
});
