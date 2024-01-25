"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("@Services/providers/gmail/service"));
class GmailController {
    gmailService;
    constructor() {
        this.gmailService = new service_1.default();
    }
    hello(req, res, next) {
        res.send('Hello to Gmail Provider');
    }
    async sandEmail(req, res, next) {
        if (!req.query.id_service) {
            return res.sendStatus(404).json({
                msg: "id_service is null"
            });
        }
        const initService = new service_1.default({ id_service: req.query.id_service });
        const serviceInfo = await initService.getServiceInfo();
        /**Authentication will move to sandEmail method */
        if ((serviceInfo instanceof Error)) {
            res.status(500).json({
                message: serviceInfo.message
            });
            return;
        }
        await initService.authenticate({
            access_token: String(serviceInfo?.authParams.access_token),
            refresh_token: String(serviceInfo?.authParams.refresh_token)
        });
        /**Here are user info like email address */
        try {
            const tokenInfo = await initService.getToken(String(serviceInfo?.authParams.access_token));
        }
        catch (error) {
            initService.refreshToken();
        }
        const sand = await initService.sandEmail();
        res.json(sand);
    }
    login(req, res, next) {
        const service = new service_1.default();
        const authUrl = service.generateAuthUrl(req.query.id_service);
        res.json({ url: authUrl });
    }
    async redirect(req, res, next) {
        const service_id = req.query.state ? JSON.parse(String(req.query.state)).service_id : undefined;
        const gmailService = new service_1.default();
        try {
            const resTokens = await gmailService.getTokensByCode(String(req.query.code));
            const userInfo = await gmailService.getUserInfo(String(resTokens.tokens.access_token));
            if (service_id) {
                console.log(userInfo);
                gmailService.updateService(service_id, {
                    provider: 'gmail',
                    email: userInfo.email,
                    authParams: {
                        access_token: String(resTokens.tokens.access_token),
                        refresh_token: String(resTokens.tokens.refresh_token)
                    }
                });
            }
            else {
                gmailService.createService({
                    provider: 'gmail',
                    email: userInfo.email,
                    authParams: {
                        access_token: String(resTokens.tokens.access_token),
                        refresh_token: String(resTokens.tokens.refresh_token)
                    }
                });
            }
            res.sendStatus(200).end(); /* .json({ tokens: resTokens }) */
        }
        catch (error) {
            res.status(401).json({ message: "non autorizzato" });
        }
    }
}
exports.default = GmailController;
