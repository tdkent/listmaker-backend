import db from "../../../db";
import { ShoppingItemReqInt } from "../../../models/item";

const createShoppingItem = async (listId: number, userId: number, item: ShoppingItemReqInt) => {
  try {
    await db.query(
      `
    INSERT INTO items_shopping ("listId", "userId", name)
    VALUES ($1, $2, $3)
    RETURNING id;
    `,
      [listId, userId, item.name]
    );
  } catch (error) {
    console.log(`An error occurred creating new shopping list item (list id ${listId}) .`);
    console.log(error);
  }
};

export default createShoppingItem;
