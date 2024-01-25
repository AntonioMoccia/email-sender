"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Email_controller_1 = __importDefault(require("../../Controllers/v1/Email.controller"));
exports.router = (0, express_1.Router)();
const emailController = new Email_controller_1.default();
exports.router.post('/send', emailController.sandEmail);
exports.default = exports.router;
