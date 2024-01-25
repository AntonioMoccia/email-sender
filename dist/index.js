"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const DataSources_1 = require("./DataSources");
const ProviderManager_1 = __importDefault(require("./Services/ProviderManager"));
const cors_1 = __importDefault(require("cors"));
const gmail_1 = __importDefault(require("./Providers/gmail"));
const Email_router_1 = __importDefault(require("./Routers/v1/Email.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
async function InitDatabase() {
    await DataSources_1.database.initialize();
}
InitDatabase();
/*
app.use('/email',EmailRouter)
const InitServicesMiddelware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = new Auth(req)
    req.auth = auth
    next()
} */
/* app.use(InitServicesMiddelware) */
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const providerManager = new ProviderManager_1.default({ app });
providerManager.use(gmail_1.default);
console.log(providerManager.getProviders());
app.use((req, res, next) => {
    req.providers = providerManager.getProviders();
    next();
});
app.use('/v1', Email_router_1.default);
const hosts = [
    'WP016.ekd.local'
];
app.post('/sand-email', async (req, res) => {
    res.send('hello world');
});
app.listen(5000, () => {
    console.log(`http://localhost:5000`);
});
