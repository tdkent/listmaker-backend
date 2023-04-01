import db from "../../../db";
import { ShoppingItemEditReqInt } from "../../../models/item";

const editShoppingItem = async (
  itemId: string,
  listId: string,
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
  RETURNING id
  `,
    [item.name, Number(itemId), Number(listId), userId]
  );
  return rows;
};

export default editShoppingItem;
