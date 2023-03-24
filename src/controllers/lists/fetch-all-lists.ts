import { RequestHandler } from "express";
import axios from "axios";

import { devDb } from "../../config/config";

const fetchAllLists: RequestHandler<{ userId: number }> = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // TODO: this route will query an actual db
    const { data } = await axios.get(`${devDb}/lists?userId=${userId}`);
    res.json(data);
  } catch (error) {
    res.status(500);
    next({ message: "An error occurred while fetching lists." });
  }
};

export default fetchAllLists;
