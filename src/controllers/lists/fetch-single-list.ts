import { RequestHandler } from "express";
import axios from "axios";

import { devDb } from "../../config/config";

const fetchList: RequestHandler<{ listId: number }> = async (req, res, next) => {
  const listId = req.params.listId;
  try {
    const { data } = await axios.get(`${devDb}/lists/${listId}`);
    res.json(data);
  } catch (error) {
    res.status(500);
    next({
      message: "An error occurred while attempting to fetch list with id",
    });
  }
};

export default fetchList;
