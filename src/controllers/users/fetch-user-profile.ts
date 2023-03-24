import { RequestHandler } from "express";

import db from "../../db";
import { UserProfileResInt } from "../../models/user";

const fetchUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const { rows }: { rows: UserProfileResInt[] } = await db.query(
      `
    SELECT id, "userEmail", "userNickname"
    FROM users
    WHERE id = $1
    `,
      [req.user.userId]
    );
    res.json({ message: "OK", user: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while fetching the user's profile data (user id ${req.user.userId}).`,
    });
  }
};

export default fetchUserProfile;
