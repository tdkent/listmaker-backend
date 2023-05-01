import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import db from "../../../db";
import { AllListTypesEnum } from "../../../models/list";
import { NewItemReqEnum, NewItemReqInt, NewShoppingItemReqEnum } from "../../../models/item";
import { NewShopItemReqInt, NewShopItemReqEnum } from "../../../models/shopping";
import { RequestErrors } from "../../../models/error";
import checkRequestBody from "../../../utils/check-req-body";

const newShoppingItem: RequestHandler<{ listId: string }> = async (req, res, next) => {
  const { userId } = req.user;
  const { listId } = req.params;
  const reqError = new RequestErrors();
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check request body
    if (!checkRequestBody(req.body, NewShoppingItemReqEnum)) {
      res.status(400);
      return next({ message: reqError.badRequest() });
    }

    const { itemName } = <NewShopItemReqInt>req.body;

    console.log(userId, listId, itemName);

    // behaviors:
    // validate user/list ids, 'Shopping' type
    // validate lower(name of item) / user id
    // if item name does not exist for the user:
    // insert new row
    // if item name does exist for the user:
    // if item is active & not checked:
    // ignore the request
    // if item is active && checked
    // uncheck the item
    // if item is not active:
    // make item active
    // check auth & list type

    await db.query(`
    CREATE OR REPLACE FUNCTION "newShopping"
      (l_id int, u_id int, i_name text)
    RETURNS text LANGUAGE plpgsql AS 
    $func$
    DECLARE
    itemid int;
    isactive bool;
    ischecked bool;
    name text;
    BEGIN
      IF NOT EXISTS
        (
          SELECT list_id
          FROM lists
          WHERE user_id = u_id
          AND list_id = l_id
          AND list_type = 'Shopping'
        )
      THEN
        RETURN 'row does not exist';
      ELSE
        isactive := (
          SELECT is_active
          FROM items_shopping
          WHERE list_id = l_id
          AND item_name = i_name
          );
        IF isactive IS NULL THEN
          INSERT INTO items_shopping
            (list_id, user_id, item_name)
          VALUES (l_id, u_id, i_name);
          RETURN i_name;  
        ELSE
          ischecked := (
            SELECT is_checked
            FROM items_shopping
            WHERE list_id = l_id
            AND item_name = i_name
          );
          IF (isactive = false) THEN
            UPDATE items_shopping
            SET is_active = true
            WHERE << GET ITEM ID ABOVE >>
          RETURN i_name || ' already exists';
        END IF;  
      END IF;
    END
    $func$;
    `);

    const { rows } = await db.query(`SELECT "newShopping" ($1, $2, $3)`, [
      listId,
      userId,
      itemName,
    ]);

    console.log(rows);

    // const { rows: checkAuth }: { rows: { listType: string }[] } = await db.query(
    //   `
    // SELECT
    //   list_type AS "listType"
    // FROM lists
    // WHERE list_id = $1 AND user_id = $2;
    // `,
    //   [Number(listId), userId]
    // );

    // // error handling
    // if (!checkAuth.length || checkAuth[0].listType !== AllListTypesEnum.shop) {
    //   res.status(401);
    //   return next({ message: reqError.nullResult() });
    // }

    // // check to see if the item exists & isChecked, isActive values
    // const { rows }: { rows: { isChecked: boolean; isActive: boolean }[] } = await db.query(
    //   `
    //   SELECT
    //     is_checked AS "isChecked",
    //     is_active AS "isActive"
    //   FROM items_shopping
    //   WHERE item_name = $1
    //   AND list_id = $2
    //   AND user_id = $3;
    // `,
    //   [itemName, Number(listId), userId]
    // );

    // // new item: create new row
    // if (!rows.length) {
    //   await db.query(
    //     `
    //     INSERT INTO items_shopping (list_id, user_id, item_name)
    //     VALUES ($1, $2, $3);
    //     `,
    //     [Number(listId), userId, itemName]
    //   );
    // }

    // // current item & checked: uncheck
    // else if (rows[0].isChecked) {
    //   await db.query(
    //     `
    //     UPDATE items_shopping
    //     SET is_checked = false, temp_category = perm_category
    //     WHERE item_name = $1 AND list_id = $2 AND user_id = $3
    //     `,
    //     [itemName, Number(listId), userId]
    //   );
    // }

    // // previous item & inactive: reactivate item
    // else if (!rows[0].isActive) {
    //   await db.query(
    //     `
    //   UPDATE items_shopping
    //   SET is_active = true
    //   WHERE item_name = $1 AND list_id = $2 AND user_id = $3
    //   `,
    //     [itemName, Number(listId), userId]
    //   );
    // }

    // previous item & active: ignore request
    // response
    res.json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500);
    next({
      message: reqError.internalServer(),
    });
  }
};

export default newShoppingItem;
