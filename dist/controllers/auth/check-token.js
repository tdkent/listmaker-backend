"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const checkToken = (req, res, next) => {
    // CORS check
    //? TODO: Upgrade this method?
    console.log(req.headers);
    if (req.method === "OPTIONS")
        return next();
    try {
        if (!req.headers.authorization || req.headers.authorization.split(" ")[0] !== "Bearer") {
            res.status(401);
            return next({
                message: "Authentication failed! Please make sure you are logged in and try again.",
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            res.status(401);
            return next({
                message: "Malformed authentication string.",
            });
        }
        // Note: jwt will throw its own error to the catch block if verification is unsuccessful
        const verify = jsonwebtoken_1.default.verify(token, config_1.jwtKey);
        req.user = { userId: verify.userId };
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401);
        next({
            message: "Authentication failed!",
        });
    }
};
exports.default = checkToken;
