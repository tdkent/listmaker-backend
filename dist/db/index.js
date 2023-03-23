"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config/config");
const connectionString = process.env.DATABASE_URL || config_1.devDb;
const db = new pg_1.Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
        }
        : undefined,
});
exports.default = db;
