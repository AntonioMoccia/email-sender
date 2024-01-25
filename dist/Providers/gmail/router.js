"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("./controller"));
const express_1 = require("express");
const gmailController = new controller_1.default();
const router = (0, express_1.Router)();
router.get('/', gmailController.base);
/**Sand email with provider authenticated */
router.post('/sand-email', gmailController.sandEmail);
/**Login routes */
router.post('/login', gmailController.login);
router.post('/update', gmailController.update);
/**redirect */
router.get('/login/google/oauth', gmailController.redirect);
exports.default = router;
/**
 *
 * Router di un provider deve avere almeno due rotte
 *
 */ 
