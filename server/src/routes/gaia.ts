import { Router } from 'express';
import { IResponse } from '../interfaces/http.interface';
import { success, error } from '../utils/response';
const router = Router();

router.post('/get', async (req, res: IResponse, next) => {
    try {
        let data = await res.blockstack.getFile(req.body.path);
        res.send(data);
    } catch (err) {
        res.status(500).json(error(err));
    }
});

router.post('/post', async (req, res: IResponse, next) => {
    try {
        let data = await res.blockstack.putFile(req.body.path, req.body.content);
        res.send(data);
    } catch (err) {
        res.status(500).json(error(err));
    }
});

router.post('/delete', async (req, res: IResponse, next) => {
    try {
        await res.blockstack.deleteFile(req.body.path);
        res.send(true);
    } catch (err) {
        res.status(500).json(error(err));
    }
});

module.exports = router;
