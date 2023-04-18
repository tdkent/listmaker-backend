import db from "../../../db";

const deactivateShoppingItem = async (itemId: string, listId: string, userId: number) => {
  const { rows }: { rows: { id: number }[] } = await db.query(
    `
  UPDATE items_shopping
  SET "isActive" = NOT "isActive"
  WHERE id = $1
  AND "listId" = $2
  AND "userId" = $3
  RETURNING id
  `,
    [Number(itemId), Number(listId), userId]
  );
  return rows;
};

export default deactivateShoppingItem;
