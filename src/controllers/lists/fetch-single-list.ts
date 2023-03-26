import { RequestHandler } from "express";

import db from "../../db";
import { NewListResInt } from "../../models/list";

const fetchList: RequestHandler<{ listId: number }> = async (req, res, next) => {
  try {
    const { rows }: { rows: NewListResInt[] } = await db.query(
      `
    SELECT * FROM lists
    WHERE id = $1
    AND "userId" = $2;
    `,
      [req.params.listId, req.user.userId]
    );
    if (!rows.length) {
      res.status(401);
      return next({
        message: `Unable to retrieve list (id ${req.params.listId}). The list may no longer exist, or you may no longer be authorized to view it.`,
      });
    }
    res.json({ message: "OK", list: rows[0] });
  } catch (error) {
    res.status(500);
    next({
      message: "An error occurred while attempting to fetch list with id",
    });
  }
};

export default fetchList;
