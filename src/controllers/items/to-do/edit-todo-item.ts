import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { EditTodoReqInt, EditTodoReqEnum } from "../../../models/todo";
import checkRequestBody from "../../../utils/check-req-body";
import { RequestErrors } from "../../../models/error";
import db from "../../../db";
import createCoordinates from "../../../utils/create-coordinates";

const editTodoItem: RequestHandler = async (req, res, next) => {
  const { userId } = req.user;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, EditTodoReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const {
      listId,
      itemId,
      itemName,
      itemCategory,
      itemLocation,
      itemDate,
      itemTime,
      isRecurring,
      recurInteger,
      recurInterval,
    }: EditTodoReqInt = req.body;

    let location: string | null = null;
    let coords: { lat: number; lng: number } | null = null;

    if (itemLocation) {
      const {
        rows: check,
      }: { rows: { item_location: string; item_coordinates: { lat: number; lng: number } }[] } =
        await db.query(
          `
        SELECT item_location, item_coordinates
        FROM items_todo
        WHERE list_id = $1
        AND todo_item_id = $2
        `,
          [listId, itemId]
        );

      location = itemLocation;

      if (itemLocation !== check[0].item_location) {
        coords = await createCoordinates(itemLocation);
        if (!coords) location = null;
      } else coords = check[0].item_coordinates;
    }

    const newRecurStr = (recur: boolean, integer: string, interval: string) => {
      if (recur) {
        let newIntegerStr: string = integer;
        let newIntervalStr: string = interval;
        if (!integer) newIntegerStr = "1";
        if (!interval) newIntervalStr = "day";
        return newIntegerStr + " " + newIntervalStr;
      }
      return null;
    };

    const { rows }: { rows: { editTodo: boolean }[] } = await db.query(
      `SELECT "editTodo" ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        itemId,
        listId,
        userId,
        itemName,
        itemCategory,
        location,
        coords,
        itemDate,
        itemTime,
        isRecurring,
        newRecurStr(isRecurring, recurInteger, recurInterval),
      ]
    );

    // null result error
    if (!rows[0].editTodo) {
      res.status(401);
      return next({ message: reqError.nullResult() });
    }

    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({ message: reqError.internalServer() });
  }
};

export default editTodoItem;
