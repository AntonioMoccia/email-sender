"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const Services_entity_1 = __importDefault(require("src/Entities/Services.entity"));
const User_1 = __importDefault(require("src/Entities/User"));
const typeorm_1 = require("typeorm");
exports.database = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin",
    database: "email_sander",
    synchronize: false,
    logging: false,
    entities: [User_1.default, Services_entity_1.default],
    subscribers: [],
    migrations: [],
});
