import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { NewListResInt, AllListTypesEnum } from "../../models/list";
import { SingleListItemTypes } from "../../models/item";
import { RequestErrors } from "../../models/error";

const fetchList: RequestHandler<{ listId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // db query
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    SELECT * FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `,
      [Number(listId), userId]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }

    // filter by list type
    let items: SingleListItemTypes = [];
    if (rows[0].type === AllListTypesEnum.shop) {
      const { rows } = await db.query(
        `
      SELECT * FROM items_shopping
      WHERE "listId" = $1 AND "isActive" = true;
      `,
        [listId]
      );
      items = rows;
    }
    if (rows[0].type === AllListTypesEnum.todo) {
      const { rows } = await db.query(
        `
      SELECT * FROM items_todo, AGE("dueDate")
      WHERE "listId" = $1;
      `,
        [listId]
      );
      items = rows;
    }
    res.json({ ...rows[0], items });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default fetchList;
