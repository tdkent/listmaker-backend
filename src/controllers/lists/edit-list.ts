import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { EditListReqInt, EditListReqEnum } from "../../models/list";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const editList: RequestHandler<{ listId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditListReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { listName } = <EditListReqInt>req.body;

    //db query
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    UPDATE lists
    SET list_name = $1
    WHERE list_id = $2
    AND user_id = $3
    RETURNING list_id AS "listId";
    `,
      [listName, Number(listId), userId]
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
    console.error(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default editList;
