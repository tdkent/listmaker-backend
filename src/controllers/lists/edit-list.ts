import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../db";
import { EditListReqInt } from "../../models/list";

const editList: RequestHandler<{ listId: number }> = async (req, res, next) => {
  try {
    //! Note: Currently the list name is the only editable field. May add others later.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const updateList = <EditListReqInt>req.body;
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    UPDATE lists
    SET name = $1
    WHERE id = $2
    AND "userId" = $3
    RETURNING id;
    `,
      [updateList.name, req.params.listId, req.user.userId]
    );
    if (!rows.length) {
      res.status(401);
      return next({
        message: `Unable to access list (id ${req.params.listId}). The list may not exist, or you may not be authorized.`,
      });
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: `An error occurred while editing list id `,
    });
  }
};

export default editList;
