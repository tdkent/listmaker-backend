"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerUser = (req, res, next) => {
    try {
        // TODO: validate form data
        // TODO: hash password
        // TODO: generate userId
        // TODO: put data into db
        // TODO: generate token
        // TODO: return user data and token
        console.log(req.body);
        res.json({ message: "register route pinged" });
    }
    catch (error) {
        next({ message: "REGISTER USER FALLBACK ERROR" });
    }
};
exports.default = registerUser;
