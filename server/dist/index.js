"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_cache_1 = __importDefault(require("node-cache"));
const cors_1 = __importDefault(require("cors"));
const radiks_server_1 = require("radiks-server");
const app = express_1.default();
const PORT = process.env.PORT || (process.env.DEBUG ? 4001 : 4000);
const Cache = new node_cache_1.default();
app.use(cors_1.default(), body_parser_1.default.json({
    limit: '50mb',
}));
app.get('/', (req, res) => {
    res.status(200).json({ ['March to Web3']: 'Alive' });
});
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
app.listen(PORT, () => __awaiter(this, void 0, void 0, function* () {
    console.log(`Express server is listening on ${PORT}!`);
    let RadiksController = yield radiks_server_1.setup({
        mongoDBUrl: process.env.MONGODB_URL,
    });
    app.use('/radiks', RadiksController);
}));
//# sourceMappingURL=index.js.map