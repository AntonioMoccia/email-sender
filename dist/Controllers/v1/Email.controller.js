"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailController {
    constructor() { }
    async sandEmail(req, res) {
        const id_service = req.query.id_service;
        const type = req.query.type;
        const provider = req.providers[type];
        const providerService = provider.getServiceInstance();
        const providerServiceInstance = new providerService({ id_service });
        const response = await providerServiceInstance.sandEmail();
        console.log(response);
        res.json({ msg: 'ok' });
    }
    async login(req, res) {
    }
    async redirect(req, res) {
    }
}
exports.default = EmailController;
