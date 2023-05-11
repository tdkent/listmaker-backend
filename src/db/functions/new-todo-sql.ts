const newTodoSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "newTodo"
    (l_id int, u_id int, i_name text)
  RETURNS bool LANGUAGE plpgsql AS
  $func$
  DECLARE
  type text;
  dupid int;
  recur text;
  BEGIN
  type := (
    SELECT list_type
    FROM lists
    WHERE list_id = l_id
    AND user_id = u_id
    );
  IF (type != 'To-Do')
  THEN
    RETURN false;
  ELSE
  dupid := (
    SELECT todo_item_id
    FROM items_todo
    WHERE LOWER(item_name) = LOWER(i_name)
    AND list_id = l_id
    ORDER BY date_updated DESC
    LIMIT 1
  );
  recur := (
    SELECT recurrence_value
    FROM items_todo
    WHERE todo_item_id = dupid
  );
  INSERT INTO items_todo
    (
      list_id,
      user_id,
      item_name,
      item_category,
      item_location,
      item_coordinates,
      time_due,
      is_recurring,
      recurrence_value,
      date_recurrence
    )
  VALUES
    (
      l_id,
      u_id,
      i_name,
      COALESCE(
        (
          SELECT item_category
          FROM items_todo
          WHERE todo_item_id = dupid
        ),
        'Home'
      ),
      COALESCE(
        (
          SELECT item_location
          FROM items_todo
          WHERE todo_item_id = dupid
        ),
        NULL
      ),
      COALESCE(
        (
          SELECT item_coordinates
          FROM items_todo
          WHERE todo_item_id = dupid
        ),
        NULL
      ),
      COALESCE(
        (
          SELECT time_due
          FROM items_todo
          WHERE todo_item_id = dupid
        ),
        NULL
      ),
      COALESCE(
        (
          SELECT is_recurring
          FROM items_todo
          WHERE todo_item_id = dupid
        ),
        false
      ),
      COALESCE(
        recur,
        NULL
      ),
      COALESCE(
        (
          SELECT CAST (CURRENT_DATE + (recur)::INTERVAL AS DATE)
        ),
        NULL
      )
    );
    RETURN true;
  END IF;
  END;
  $func$;
  `;
};

export default newTodoSql;
