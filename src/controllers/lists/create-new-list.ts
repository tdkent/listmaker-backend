import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";

import db from "../../db";
import { NewListReqInt, NewListResInt } from "../../models/lists";

const createNewList: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const newList = <NewListReqInt>req.body;
    const { rows: check } = await db.query(
      `
    SELECT id FROM lists
    WHERE name = $1
    AND "userId" = $2
    `,
      [newList.name, req.user.userId]
    );
    if (check.length) {
      res.status(422);
      return next({
        message: `You already have a list named ${newList.name}. Please enter a new name and try again.`,
      });
    }
    const slug = slugify(newList.name.toLowerCase());
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    INSERT INTO lists("userId", name, slug, type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [req.user.userId, newList.name, slug, newList.type]
    );
    res.json({ message: "OK", list: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: "An error occurred while creating the new list. Please try again later.",
    });
  }
};

export default createNewList;
