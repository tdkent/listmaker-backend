"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const build_tables_1 = __importDefault(require("./build-tables"));
const build_functions_1 = __importDefault(require("./build-functions"));
const buildDevDb = async () => {
    try {
        await (0, build_tables_1.default)();
        await (0, build_functions_1.default)();
    }
    catch (error) {
        console.log(error);
        throw new Error("An error occurred while rebuilding the database.");
    }
};
buildDevDb().finally(() => _1.default.end());
