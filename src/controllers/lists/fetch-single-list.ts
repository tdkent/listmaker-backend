import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { NewListResInt } from "../../models/list";
import { RequestErrors } from "../../models/error";

const fetchList: RequestHandler<{ listId: number }> = async (req, res, next) => {
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
      [listId, userId]
    );

    // null result error
    if (!rows.length) {
      res.status(401);
      return next({
        message: reqError.nullResult(),
      });
    }
    res.json({ message: "OK", list: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default fetchList;
