import db from "../../../db";

const checkTodoItem = async (
  itemId: string,
  isChecked: boolean,
  listId: string,
  userId: number
) => {
  // if (isChecked) {
  //   const { rows }: { rows: { id: number }[] } = await db.query(
  //     `
  // UPDATE items_todo
  // SET "isChecked" = false, temp_category = perm_category
  // WHERE id = $1
  // AND "listId" = $2
  // AND "userId" = $3
  // RETURNING id;
  // `,
  //     [Number(itemId), Number(listId), userId]
  //   );
  //   return rows;
  // } else {
  //   const { rows }: { rows: { id: number }[] } = await db.query(
  //     `
  // UPDATE items_todo
  // SET "isChecked" = true, temp_category = '__checked'
  // WHERE id = $1
  // AND "listId" = $2
  // AND "userId" = $3
  // RETURNING id;
  // `,
  //     [Number(itemId), Number(listId), userId]
  //   );
  //   return rows;
  // }
  const { rows }: { rows: { id: number }[] } = await db.query(
    `
  UPDATE items_todo
  SET "isChecked" = NOT "isChecked"
  WHERE id = $1 AND "listId" = $2 AND "userId" = $3
  RETURNING id;
  `,
    [Number(itemId), Number(listId), userId]
  );
  return rows;
};

export default checkTodoItem;
