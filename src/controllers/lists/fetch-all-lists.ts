import { RequestHandler } from "express";

import db from "../../db";
import { NewListResInt } from "../../models/list";

const fetchAllLists: RequestHandler = async (req, res, next) => {
  try {
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    SELECT * FROM lists
    WHERE "userId" = $1
    `,
      [req.user.userId]
    );
    res.json({ message: "OK", lists: rows });
  } catch (error) {
    res.status(500);
    next({ message: "An error occurred while fetching lists." });
  }
};

export default fetchAllLists;
