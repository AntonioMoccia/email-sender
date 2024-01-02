"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataSources_1 = require("src/DataSources");
const User_1 = __importDefault(require("src/Entities/User"));
const Auth_service_1 = __importDefault(require("../Services/Auth.service"));
class UserController {
    static createUser(req, res) {
        const create_user = DataSources_1.database.getRepository(User_1.default);
        const encryptedPass = Auth_service_1.default.encryptPass('stringa');
        console.log(encryptedPass);
        /*     create_user.create({
                ...user
            }) */
    }
}
exports.default = UserController;
