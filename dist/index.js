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
const Auth_service_1 = __importDefault(require("./Services/Auth.service"));
const Email_service_1 = __importDefault(require("./Services/Email.service"));
const Services_entity_1 = __importDefault(require("./Entities/Services.entity"));
const app = (0, express_1.default)();
async function InitDatabase() {
    await DataSources_1.database.initialize();
}
const InitServicesMiddelware = async (req, res, next) => {
    const auth = new Auth_service_1.default(req);
    req.auth = auth;
    next();
};
app.use(express_1.default.json());
app.use(InitServicesMiddelware);
InitDatabase();
const hosts = [
    'WP016.ekd.local'
];
app.post('/sand-email', async (req, res) => {
    const eamilService = new Email_service_1.default();
    const { email, number, name, text, subject } = req.body;
    try {
        const serviceRepo = DataSources_1.database.getRepository(Services_entity_1.default);
        await serviceRepo.insert({
            auth: {
                valore: 'hjvdjvfsdj',
            },
            service_type: 'gmail'
        });
        await eamilService.sandEmail({
            name,
            email,
            number,
            text,
            subject,
            service_type: 'gmail'
        });
        return res.status(200).json({
            message: 'email sanded'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'qualcosa è andato storto'
        });
    }
    res.send('hello world');
});
app.listen(5000, () => {
    console.log(`http://localhost:5000`);
});
