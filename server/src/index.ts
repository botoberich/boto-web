const express = require('express');
const cors = require('cors');
const { setup } = require('radiks-server');

const app = express();
const PORT = 4000;

app.use(cors());
app.listen(PORT, async () => {
    console.log(`EXPRESS SERVER LISTENING ON PORT ${PORT}!`);

    let RadiksController = await setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });

    app.use('/radiks', RadiksController);
});
