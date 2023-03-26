import db from "../../../db";
import { ShoppingItemInt } from "../../../models/item";

const createShoppingItem = async (listId: number, item: ShoppingItemInt) => {
  try {
    await db.query(
      `
    INSERT INTO items_shopping ("listId", name, "isChecked")
    VALUES ($1, $2, $3)
    RETURNING id;
    `,
      [listId, item.name, item.isChecked]
    );
  } catch (error) {
    console.log(`An error occurred creating new shopping list item (list id ${listId}) .`);
    console.log(error);
  }
};

export default createShoppingItem;
