"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.basePath = void 0;
const Email_controller_1 = __importDefault(require("../Controllers/Email.controller"));
const express_1 = require("express");
exports.basePath = '/';
exports.router = (0, express_1.Router)();
exports.router.post('/email/sand', Email_controller_1.default.sandEmail);
