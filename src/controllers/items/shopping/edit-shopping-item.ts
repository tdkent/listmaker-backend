import db from "../../../db";

const editShoppingItem = async (
  itemId: string,
  listId: string,
  userId: number,
  name: string,
  category: string,
  isChecked: boolean
) => {
  if (!isChecked) {
    const { rows } = await db.query(
      `
    UPDATE items_shopping
    SET name = $1, perm_category = $2, temp_category = $2
    WHERE id = $3
    AND "listId" = $4
    AND "userId" = $5
    RETURNING id
    `,
      [name, category, Number(itemId), Number(listId), userId]
    );
    return rows;
  } else {
    const { rows } = await db.query(
      `
  UPDATE items_shopping
  SET name = $1, perm_category = $2
  WHERE id = $3
  AND "listId" = $4
  AND "userId" = $5
  RETURNING id
  `,
      [name, category, Number(itemId), Number(listId), userId]
    );
    return rows;
  }
};

export default editShoppingItem;
