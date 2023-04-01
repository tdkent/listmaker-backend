import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { RequestErrors } from "../../models/error";

const deleteList: RequestHandler<{ listId: number }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // db query
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    DELETE FROM lists
    WHERE id = $1
    AND "userId" = $2
    RETURNING id;
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
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default deleteList;
