import db from "../../../db";
import { ShoppingItemNewReqInt } from "../../../models/item";

const createShoppingItem = async (listId: string, userId: number, item: ShoppingItemNewReqInt) => {
  // check to see if the item exists and isActive value
  const { rows }: { rows: { name: string; isActive: boolean }[] } = await db.query(
    `
  SELECT name, "isActive" FROM items_shopping
  WHERE name = $1 AND "listId" = $2 AND "userId" = $3
  `,
    [item.name, listId, userId]
  );
  if (!rows.length) {
    return await db.query(
      `
      INSERT INTO items_shopping ("listId", "userId", name)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      [Number(listId), userId, item.name]
    );
  }
  if (!rows[0].isActive) {
    return await db.query(
      `
    UPDATE items_shopping
    SET "isActive" = true
    WHERE name = $1 AND "listId" = $2 AND "userId" = $3
    `,
      [rows[0].name, listId, userId]
    );
  }
  return;
};

export default createShoppingItem;
