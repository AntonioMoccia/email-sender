"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const dns_1 = __importDefault(require("dns"));
class AuthService {
    constructor(req) { }
    login() {
        return 'hello';
    }
    logout() { }
    logOn;
    compareToken;
    cryptPass;
    extractTokenFromHeader;
    checkDomainExist(req) {
        const hosts = [];
        dns_1.default.lookupService(req.ip, 5000, (error, host, service) => {
            if (error) {
                console.log('non sei autorizzato');
                return;
            }
            if (!hosts.includes(host)) {
                console.log('non sei nella lista');
                return;
            }
            return console.log('sei nella lista');
        });
    }
    static encryptPass(password) {
        const saltRounds = 10;
        const salt = bcrypt_1.default.genSaltSync(saltRounds);
        const hash = bcrypt_1.default.hashSync(password, salt);
        return hash;
    }
}
exports.default = AuthService;
