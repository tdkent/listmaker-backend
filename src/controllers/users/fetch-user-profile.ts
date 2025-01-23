import { RequestHandler } from "express";

import db from "../../db";
import { UserProfileResInt } from "../../models/user";
import { RequestErrors } from "../../models/error";

const fetchUserProfile: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // db query
    const { rows }: { rows: UserProfileResInt[] } = await db.query(
      `
    SELECT
      user_id AS "userId",
      user_email AS "userEmail",
      user_nickname AS "userNickname"
    FROM users WHERE user_id = $1;
    `,
      [userId]
    );
    res.json({ user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500);
    return next({
      message: reqError.internalServer(),
    });
  }
};

export default fetchUserProfile;
