var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const { setup } = require('radiks-server');
const app = express();
const PORT = 4000;
app.listen(PORT, () => __awaiter(this, void 0, void 0, function* () {
    console.log(`EXPRESS SERVER LISTENING ON PORT ${PORT}!`);
    let RadiksController = yield setup({
        mongoDBUrl: process.env.MONGODB_URL
    });
    app.use('/radiks', RadiksController);
}));
//# sourceMappingURL=index.js.map