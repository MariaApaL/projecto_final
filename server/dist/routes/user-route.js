"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const verifyToken_1 = require("../middlewares/verifyToken");
const userRoute = (0, express_1.Router)();
userRoute.post('/login', user_controller_1.default.prototype.login);
userRoute.post('/register', user_controller_1.default.prototype.register);
userRoute.get('/getProfile', verifyToken_1.verifyToken, user_controller_1.default.prototype.getProfile); //Solo puedes acceder si tienes un token verificado
exports.default = userRoute;
