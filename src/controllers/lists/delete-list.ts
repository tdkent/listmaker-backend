import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { RequestErrors } from "../../models/error";
import { AllListTypesEnum } from "../../models/list";

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

    // detemine list type
    const { rows }: { rows: { type: string }[] } = await db.query(
      `
    SELECT type FROM lists
    WHERE id = $1 
    AND "userId" = $2 
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

    // filter by list type
    //? put each filter type into a separate file?
    if (rows[0].type === AllListTypesEnum.shop) {
      // delete items
      await db.query(
        `
      DELETE FROM items_shopping
      WHERE "listId" = $1
      `,
        [listId]
      );

      // delete list
      await db.query(
        `
      DELETE FROM lists
      WHERE id = $1;
      `,
        [listId]
      );
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
