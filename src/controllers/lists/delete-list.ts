import { RequestHandler } from "express";

import db from "../../db";

const deleteList: RequestHandler<{ listId: number }> = async (req, res, next) => {
  try {
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
    DELETE FROM lists
    WHERE id = $1
    AND "userId" = $2
    RETURNING id;
    `,
      [req.params.listId, req.user.userId]
    );
    if (!rows.length) {
      res.status(401);
      return next({
        message: `Unable to delete list (id ${req.params.listId}). The list may no longer exist, or you may not be authorized to delete it.`,
      });
    }
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: `An error occurred attempting to delete list id ${req.params.listId}.`,
    });
  }
};

export default deleteList;
