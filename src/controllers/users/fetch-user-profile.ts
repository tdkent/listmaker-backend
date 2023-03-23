import { RequestHandler } from "express";

import db from "../../db";
import { UserProfileInt, UserProfileDbInt } from "../../models/user";

const fetchUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const { rows }: { rows: UserProfileDbInt[] } = await db.query(
      `
    SELECT "userEmail", "userNickname"
    FROM users
    WHERE id = $1
    `,
      [req.user.userId]
    );
    const user: UserProfileInt = {
      userId: req.user.userId,
      ...rows[0],
    };
    res.json({ message: "OK", user });
  } catch (error) {
    console.log(error);
    res.status(500);
    return next({
      message: `An error occurred while fetching the user's profile data (user id ${req.user.userId}).`,
    });
  }
};

export default fetchUserProfile;
