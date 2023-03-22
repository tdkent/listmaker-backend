import { RequestHandler } from "express";
import axios from "axios";

const fetchUserLists: RequestHandler<{ userId: number }> = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("userId: ", userId);
    res.json({ userId });
  } catch (error) {
    res.status(500);
  }
};

export default fetchUserLists;
