import db from "../../../db";
import { ShoppingItemEditReqInt } from "../../../models/item";

const editShoppingItem = async (
  itemId: number,
  listId: number,
  userId: number,
  item: ShoppingItemEditReqInt
) => {
  const { rows } = await db.query(
    `
  UPDATE items_shopping
  SET name = $1
  WHERE id = $2
  AND "listId" = $3
  AND "userId" = $4
  RETURNING *
  `,
    [item.name, itemId, listId, userId]
  );
  return rows;
};

export default editShoppingItem;
