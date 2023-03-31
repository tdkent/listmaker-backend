import { RequestHandler } from "express";

import db from "../../db";
import { NewListResInt } from "../../models/list";
import { ErrorMsgEnum } from "../../models/error";

const fetchAllLists: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  try {
    // db query
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    SELECT * FROM lists
    WHERE "userId" = $1
    `,
      [userId]
    );
    res.json({ message: "OK", lists: rows });
  } catch (error) {
    res.status(500);
    next({ message: ErrorMsgEnum.internalServer });
  }
};

export default fetchAllLists;
