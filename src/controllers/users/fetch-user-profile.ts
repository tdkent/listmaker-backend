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
    SELECT id, "userEmail", "userNickname"
    FROM users
    WHERE id = $1
    `,
      [userId]
    );
    res.json({ message: "OK", user: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: reqError.internalServer(),
    });
  }
};

export default fetchUserProfile;
