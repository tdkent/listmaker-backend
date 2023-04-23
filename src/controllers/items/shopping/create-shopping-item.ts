import db from "../../../db";

const createShoppingItem = async (listId: string, userId: number, name: string) => {
  // check to see if the item exists and isActive value
  const { rows }: { rows: { name: string; isActive: boolean }[] } = await db.query(
    `
  SELECT name, "isActive" FROM items_shopping
  WHERE name = $1 AND "listId" = $2 AND "userId" = $3
  `,
    [name, listId, userId]
  );
  if (!rows.length) {
    return await db.query(
      `
      INSERT INTO items_shopping ("listId", "userId", name)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      [Number(listId), userId, name]
    );
  }
  if (!rows[0].isActive) {
    return await db.query(
      `
    UPDATE items_shopping
    SET "isActive" = true
    WHERE name = $1 AND "listId" = $2 AND "userId" = $3
    `,
      [name, listId, userId]
    );
  }
  return;
};

export default createShoppingItem;
