import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";

import db from "../../db";
import { NewListReqInt, NewListResInt, NewListReqEnum } from "../../models/list";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const newList: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, NewListReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { listName, listType } = <NewListReqInt>req.body;

    // same name check
    const { rows: check }: { rows: { id: number }[] } = await db.query(
      `
    SELECT list_id FROM lists
    WHERE list_name = $1
    AND list_type = $2
    AND user_id = $3
    `,
      [listName, listType, userId]
    );

    if (check.length) {
      res.status(422);
      return next({
        message: reqError.duplicateList(listType, listName),
      });
    }

    // db query
    const slug = slugify(listName.toLowerCase());
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    INSERT INTO lists (
      user_id,
      list_name,
      list_slug,
      list_type
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      list_id AS "listId",
      list_slug AS "listSlug";
    `,
      [userId, listName, slug, listType]
    );
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default newList;
