import db from "../../../db";
import { ShoppingItemNewReqInt } from "../../../models/item";

const createShoppingItem = async (listId: string, userId: number, item: ShoppingItemNewReqInt) => {
  await db.query(
    `
    INSERT INTO items_shopping ("listId", "userId", name)
    VALUES ($1, $2, $3)
    RETURNING id;
    `,
    [Number(listId), userId, item.name]
  );
};

export default createShoppingItem;
