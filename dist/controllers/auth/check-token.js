"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
// authenticate token
// this route will be placed above any authenticated routes to intercept traffic and check token
// token located in req.headers.authentication as string 'Bearer <token>'
// TODO: check for req.headers.authentication and string for 'Bearer'
// TODO: return error if not present
// TODO: check string for a token string after 'Bearer ' (use split method)
// TODO: if not present, return error
// TODO: use jwt.verify(token, secret) to authenticate the token
// TODO: If token is verified, extract the userId from the token and place into req.user
// TODO: Pass to the next function with next()
const checkToken = (req, res, next) => {
    // CORS check
    //? TODO: Upgrade this method?
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
