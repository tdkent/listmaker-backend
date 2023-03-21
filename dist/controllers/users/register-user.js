"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerUser = (req, res, next) => {
    try {
        console.log(req.body);
    }
    catch (error) {
        next({ message: "REGISTER USER FALLBACK ERROR" });
    }
};
exports.default = registerUser;
