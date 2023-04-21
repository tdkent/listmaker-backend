import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";

import db from "../../db";
import { NewListReqInt, NewListResInt, NewListReqEnum } from "../../models/list";
import { RequestErrors } from "../../models/error";
import checkRequestBody from "../../utils/check-req-body";

const createNewList: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newList = <NewListReqInt>req.body;

    // check request body
    if (!checkRequestBody(newList, NewListReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    // same name check
    const { rows: check }: { rows: { id: number }[] } = await db.query(
      `
    SELECT id FROM lists
    WHERE name = $1
    AND "userId" = $2
    `,
      [newList.name, userId]
    );

    if (check.length) {
      res.status(422);
      return next({
        message: reqError.duplicateList(newList.name),
      });
    }

    // db query
    const slug = slugify(newList.name.toLowerCase());
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    INSERT INTO lists("userId", name, slug, type)
    VALUES ($1, $2, $3, $4)
    RETURNING id, slug;
    `,
      [userId, newList.name, slug, newList.type]
    );
    res.json({ list: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default createNewList;
