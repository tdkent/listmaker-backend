import db from "../../../db";

// behaviors:
// a new row is added for the item regardless if user has created the same previously
// basic fields: name, category, due date (same day), isChecked
// due date default: same day
// advanced fields: notes (text), location (address / map (?))
// categories: Home, Work, Family, Leisure, Errand
// If a new item is created that user has previously created, copy the following fields (from the most recently created version using date added column)
// copied fields: name, category, notes, location
// if the item does not exist, create a new item with default category (Home(?)) and due date (same day)
const createTodoItem = async (listId: string, userId: number, name: string) => {
  // check if item exists
  const { rows }: { rows: { id: number }[] } = await db.query(
    `
    SELECT id FROM items_todo
    WHERE name = $1 AND "listId" = $2 AND "userId" = $3
    `,
    [name, Number(listId), userId]
  );

  // item does not exist
  if (!rows.length) {
    return await db.query(
      `
        INSERT INTO items_todo ("listId", "userId", name)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
      [Number(listId), userId, name]
    );
  }

  // item exists
  else {
    return;
  }
};

export default createTodoItem;
