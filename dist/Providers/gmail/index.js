"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
const router_1 = __importDefault(require("./router"));
const controller_1 = __importDefault(require("./controller"));
const service_1 = __importDefault(require("./service"));
class GmailProvider {
    config;
    constructor() {
    }
    init() {
        this.config = config_json_1.default;
    }
    getRouter() {
        return router_1.default;
    }
    getController() {
        const gmailController = new controller_1.default();
        return gmailController;
    }
    getVersion() {
    }
    getServiceInstance() {
        return service_1.default;
    }
}
exports.default = GmailProvider;
