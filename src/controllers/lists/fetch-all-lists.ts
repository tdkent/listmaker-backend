import { RequestHandler } from "express";

import db from "../../db";
import { NewListResInt } from "../../models/list";
import { RequestErrors } from "../../models/error";

const fetchAllLists: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // db query
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    SELECT * FROM lists
    WHERE "userId" = $1
    `,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500);
    next({ message: reqError.internalServer() });
  }
};

export default fetchAllLists;
