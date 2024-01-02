"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Email_service_1 = __importDefault(require("../Services/Email.service"));
class EmailController {
    constructor() { }
    static async sandEmail(req, res) {
        new Email_service_1.default().sandEmail(req.body);
    }
}
exports.default = EmailController;
