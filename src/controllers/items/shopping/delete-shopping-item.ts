import db from "../../../db";

const deleteShoppingItem = async (itemId: string, listId: string, userId: number) => {
  const { rows }: { rows: { id: number }[] } = await db.query(
    `
  DELETE FROM items_shopping
  WHERE id = $1
  AND "listId" = $2
  AND "userId" = $3
  RETURNING id
  `,
    [Number(itemId), Number(listId), userId]
  );
  return rows;
};

export default deleteShoppingItem;
