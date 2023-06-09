"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../../db"));
const list_1 = require("../../models/list");
const error_1 = require("../../models/error");
const fetchList = async (req, res, next) => {
    const { userId } = req.user;
    const { listId } = req.params;
    const reqError = new error_1.RequestErrors();
    try {
        // validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // db query
        const { rows } = await db_1.default.query(`
    SELECT
      list_id AS "listId",
      user_id AS "userId",
      list_name AS "listName",
      list_slug AS "listSlug",
      list_type AS "listType"
    FROM lists
    WHERE list_id = $1
    AND user_id = $2;
    `, [Number(listId), userId]);
        // null result error
        if (!rows.length) {
            res.status(401);
            return next({
                message: reqError.nullResult(),
            });
        }
        // filter by list type
        let items = [];
        if (rows[0].listType === list_1.AllListTypesEnum.shop) {
            const { rows } = await db_1.default.query(`
      SELECT
        shop_item_id AS "itemId",
        list_id AS "listId",
        user_id AS "userId",
        item_name AS "itemName",
        reference_category AS "refCategory",
        display_category AS "dispCategory",
        is_checked AS "isChecked"
      FROM items_shopping
      WHERE list_id = $1
      AND is_active = true;
      `, [listId]);
            items = rows;
        }
        if (rows[0].listType === list_1.AllListTypesEnum.todo) {
            const { rows: todos } = await db_1.default.query(`
      SELECT
        todo_item_id AS "itemId",
        list_id AS "listId",
        user_id AS "userId",
        item_name AS "itemName",
        item_category AS "itemCategory",
        item_location AS "itemLocation",
        item_coordinates AS "itemCoords",
        date_updated AS "dateUpdated",
        to_char(date_due, 'YYYY-MM-DD') AS "dateDue",
        date_completed AS "dateCompleted",
        time_due AS "timeDue",
        is_checked AS "isChecked",
        is_recurring AS "isRecurring",
        recurrence_value AS "recurVal",
        date_recurrence AS "dateRecurring"
      FROM items_todo, AGE(date_due)
      WHERE list_id = $1
      AND is_active = true;
      `, [listId]);
            const { rows: tasks } = await db_1.default.query(`
      SELECT
        subtask_id AS "taskId",
        todo_item_id AS "itemId",
        task_name AS "taskName",
        is_checked AS "isChecked"
      FROM todo_subtasks
      WHERE list_id = $1;
      `, [listId]);
            const todosWithTasks = todos.map((todo) => {
                const itemTasks = tasks.filter((task) => task.itemId === todo.itemId);
                return { ...todo, itemTasks };
            });
            items = todosWithTasks;
        }
        // response
        const data = { ...rows[0], items };
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500);
        next({
            message: reqError.internalServer(),
        });
    }
};
exports.default = fetchList;
