import { Router } from "express";
import { body } from "express-validator";

import checkToken from "../controllers/auth/check-token";
import fetchUserProfile from "../controllers/users/fetch-user-profile";
import editUserProfile from "../controllers/users/edit-user-profile";

const router = Router();

// auth check
router.use(checkToken);

// fetch user profile
router.get("/profile", fetchUserProfile);

// edit user profile
router.patch(
  "/profile",
  //! Note: Request body will eventually contain additional fields
  body("userNickname")
    .isString()
    .withMessage("Your nickname is improperly formatted. Please try again.")
    .isLength({ max: 24 })
    .withMessage("Please make sure your nickname length is 24 characters or less.")
    .trim()
    .escape(),
  editUserProfile
);

export default router;
