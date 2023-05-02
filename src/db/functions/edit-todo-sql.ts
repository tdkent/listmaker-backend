const editTodoSql = () => {
  return `
    CREATE OR REPLACE FUNCTION "editTodo" (
        i_id int,
        l_id int,
        u_id int,
        i_name text,
        i_cat text,
        i_loc text,
        i_date date,
        i_time time
      )
    RETURNS bool LANGUAGE plpgsql
    AS $$
    BEGIN
      IF NOT EXISTS
      (
        SELECT item_name
        FROM items_todo
        WHERE todo_item_id = i_id
        AND list_id = l_id
        AND user_id = u_id
      )
      THEN
        RETURN false;
      ELSE
        IF (i_cat = 'Home') THEN
          UPDATE items_todo
          SET
            item_name = i_name,
            item_category = i_cat,
            item_location = NULL,
            date_due = i_date,
            time_due = NULL,
            date_updated = CURRENT_TIMESTAMP
          WHERE todo_item_id = i_id
          AND list_id = l_id
          AND user_id = u_id;
        ELSEIF (i_cat = 'Work') THEN
          UPDATE items_todo
          SET
            item_name = i_name,
            item_category = i_cat,
            item_location = NULL,
            date_due = i_date,
            time_due = i_time,
            date_updated = CURRENT_TIMESTAMP
          WHERE todo_item_id = i_id
          AND list_id = l_id
          AND user_id = u_id;
        ELSEIF (i_cat = 'Errand') THEN
          UPDATE items_todo
          SET
            item_name = i_name,
            item_category = i_cat,
            item_location = i_loc,
            date_due = i_date,
            time_due = NULL,
            date_updated = CURRENT_TIMESTAMP
          WHERE todo_item_id = i_id
          AND list_id = l_id
          AND user_id = u_id;
        ELSE
          UPDATE items_todo
          SET
            item_name = i_name,
            item_category = i_cat,
            item_location = i_loc,
            date_due = i_date,
            time_due = i_time,
            date_updated = CURRENT_TIMESTAMP
          WHERE todo_item_id = i_id
          AND list_id = l_id
          AND user_id = u_id;
        END IF;
        RETURN true;
      END IF;
    END $$;
  `;
};

export default editTodoSql;

// ALTERNATE:
// const { itemCategory } = <EditTodoReqInt>req.body;

// // sanitize request body
// let body: EditTodoReqInt;
// if (itemCategory === TodoCatsEnum.home) {
//   body = { ...req.body, itemLocation: null, itemTime: null };
// } else if (itemCategory === TodoCatsEnum.work) {
//   body = { ...req.body, itemLocation: null };
// } else if (itemCategory === TodoCatsEnum.errand) {
//   body = { ...req.body, itemTime: null };
// } else body = { ...req.body };

// // query
// const { rows }: { rows: { id: number }[] } = await db.query(
//   `
// UPDATE items_todo
// SET
//   item_name = $1,
//   item_category = $2,
//   item_location = $3,
//   date_due = $4,
//   date_updated = CURRENT_TIMESTAMP,
//   time_due = $5
// WHERE todo_item_id = $6
// AND list_id = $7
// AND user_id = $8
// RETURNING todo_item_id AS "id";
// `,
//   [
//     body.itemName,
//     body.itemCategory,
//     body.itemLocation,
//     body.itemDate,
//     body.itemTime,
//     body.itemId,
//     body.listId,
//     userId,
//   ]
// );
