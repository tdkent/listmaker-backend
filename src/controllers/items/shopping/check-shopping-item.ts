import db from "../../../db";

const checkShoppingItem = async (
  itemId: string,
  isChecked: boolean,
  listId: string,
  userId: number
) => {
  // if isChecked, change to false
  // change temp_category to match perm_category
  if (isChecked) {
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
  UPDATE items_shopping
  SET "isChecked" = false, temp_category = perm_category
  WHERE id = $1
  AND "listId" = $2
  AND "userId" = $3
  RETURNING id;
  `,
      [Number(itemId), Number(listId), userId]
    );
    return rows;
  } else {
    // if !isChecked, change to true
    // change temp_category to "Checked"
    const { rows }: { rows: { id: number }[] } = await db.query(
      `
  UPDATE items_shopping
  SET "isChecked" = true, temp_category = 'Checked'
  WHERE id = $1
  AND "listId" = $2
  AND "userId" = $3
  RETURNING id;
  `,
      [Number(itemId), Number(listId), userId]
    );
    return rows;
  }
};

export default checkShoppingItem;
