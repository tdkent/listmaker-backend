"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchUserLists = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log("userId: ", userId);
        res.json({ userId });
    }
    catch (error) {
        res.status(500);
    }
};
exports.default = fetchUserLists;
