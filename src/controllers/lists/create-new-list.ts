import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import slugify from "slugify";

import db from "../../db";
import { NewListReqInt, NewListResInt } from "../../models/lists";

const createNewList: RequestHandler = async (req, res, next) => {
  try {
    // TODO: prevent user from creating two lists with the same name
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      if (error[0].param === "name") {
        res.status(422);
        return next({
          message: "Please enter a list name and try again.",
        });
      }
      if (error[0].param === "type") {
        res.status(422);
        return next({
          message: "Please select one of the provided list types and try again.",
        });
      }
    }
    const newList = <NewListReqInt>req.body;
    const slug = slugify(newList.name.toLowerCase());
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    INSERT INTO lists("userId", name, slug, type)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [req.user.userId, newList.name, slug, newList.type]
    );
    console.log("Rows", rows);
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
