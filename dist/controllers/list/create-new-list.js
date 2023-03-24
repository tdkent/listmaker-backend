"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createNewList = (req, res, next) => {
    const userId = req.user.userId;
    try {
        // TODO: name cannot be empty, should be escaped
        // TODO: check for accepted list type strings only
        // TODO: if form passes error checks, add userId req.user to req.body
        // TODO: add the  new list to the lists sql table
        // TODO: need to create the new table, add to build-tables func
        // TODO: consolidate lists and list routes into lists
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: "An error occurred while creating the new list. Please try again later.",
        });
    }
};
exports.default = createNewList;
