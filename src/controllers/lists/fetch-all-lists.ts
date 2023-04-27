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
    SELECT 
      list_id AS "listId",
      user_id AS "userId",
      list_name AS "listName",
      list_slug AS "listSlug",
      list_type AS "listType"   
    FROM lists
    WHERE user_id = $1
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
