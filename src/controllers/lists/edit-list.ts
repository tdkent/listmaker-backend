import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { EditListReqFieldsInt, EditListReqFieldsEnum } from "../../models/list";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const editList: RequestHandler<{ listId: number }> = async (req, res, next) => {
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
    const updateList = <EditListReqFieldsInt>req.body;
    if (!checkRequestBody(updateList, EditListReqFieldsEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    //db query
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    UPDATE lists
    SET name = $1
    WHERE id = $2
    AND "userId" = $3
    RETURNING id;
    `,
      [updateList.name, listId, userId]
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

export default editList;
