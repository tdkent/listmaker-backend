"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const buildDbTables = async () => {
    try {
        console.log("Dropping old tables...");
        await _1.default.query(`
    DROP TABLE IF EXISTS items_todo;
    DROP TABLE IF EXISTS items_shopping;
    DROP TABLE IF EXISTS lists;
    DROP TABLE IF EXISTS users;
    `);
        console.log("Creating new tables...");
        await _1.default.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      user_email VARCHAR(255) UNIQUE NOT NULL,
      user_nickname VARCHAR(255),
      user_password VARCHAR(255) NOT NULL
    );
    CREATE TABLE lists (
      list_id SERIAL PRIMARY KEY,
      user_id SMALLINT REFERENCES users(user_id),
      list_name VARCHAR(255) NOT NULL,
      list_slug VARCHAR(255) NOT NULL,
      list_type VARCHAR(12) NOT NULL
    );
    CREATE TABLE items_shopping (
      shop_item_id SERIAL PRIMARY KEY,
      list_id SMALLINT REFERENCES lists(list_id),
      user_id SMALLINT REFERENCES users(user_id),
      item_name VARCHAR(255) NOT NULL,
      perm_category VARCHAR(255) NOT NULL DEFAULT 'Uncategorized',
      temp_category VARCHAR(255) NOT NULL DEFAULT 'Uncategorized',
      is_checked BOOLEAN NOT NULL DEFAULT false,
      is_active BOOLEAN NOT NULL DEFAULT true
    );
    CREATE TABLE items_todo (
      todo_item_id SERIAL PRIMARY KEY,
      list_id SMALLINT REFERENCES lists(list_id),
      user_id SMALLINT REFERENCES users(user_id),
      item_name VARCHAR(255) NOT NULL,
      item_category VARCHAR(12) NOT NULL,
      date_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      date_due DATE NOT NULL DEFAULT CURRENT_DATE,
      date_completed DATE,
      is_checked BOOLEAN NOT NULL DEFAULT false,
      is_active BOOLEAN NOT NULL DEFAULT true
    )
    `);
        console.log("Finished rebuilding tables!");
    }
    catch (error) {
        console.log(error);
        throw new Error("An error occurred while building db tables.");
    }
};
exports.default = buildDbTables;
