"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
const router_1 = __importDefault(require("./router"));
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
    }
}
exports.default = GmailProvider;
