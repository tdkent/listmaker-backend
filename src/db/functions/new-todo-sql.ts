const newTodoSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "newTodo" (l_id int, u_id int, i_name text)
  RETURNS bool LANGUAGE plpgsql
  AS $$
  DECLARE
  type text;
  recur text;
  BEGIN
    IF NOT EXISTS
      (SELECT list_type FROM lists WHERE list_id = l_id AND user_id = u_id)
    THEN
      RETURN false;
    ELSE
      type := (SELECT list_type FROM lists WHERE list_id = l_id AND user_id = u_id);
      IF (type = 'To-Do') THEN
        recur := (
          SELECT recurrence_value
          FROM items_todo
          WHERE LOWER(item_name) = LOWER(i_name)
          AND user_id = u_id
          ORDER BY date_updated
          DESC LIMIT 1
        );
        INSERT INTO items_todo
          (
            list_id,
            user_id,
            item_name,
            item_category,
            item_location,
            time_due,
            is_recurring,
            recurrence_value,
            date_recurrence
          )
        VALUES
          (
            l_id, u_id, i_name,
            COALESCE(
              (
                SELECT item_category
                FROM items_todo
                WHERE LOWER(item_name) = LOWER(i_name)
                AND user_id = u_id
                ORDER BY date_updated DESC LIMIT 1
              ), 'Home'),
            COALESCE(
              (
                SELECT item_location
                FROM items_todo
                WHERE LOWER(item_name) = LOWER(i_name)
                AND user_id = u_id
                ORDER BY date_updated DESC LIMIT 1
              ), NULL),
            COALESCE(
              (
                SELECT time_due
                FROM items_todo
                WHERE LOWER(item_name) = LOWER(i_name)
                AND user_id = u_id
                ORDER BY date_updated DESC LIMIT 1
                ), NULL),
            COALESCE(
              (
                SELECT is_recurring
                FROM items_todo
                WHERE LOWER(item_name) = LOWER(i_name)
                AND user_id = u_id
                ORDER BY date_updated DESC LIMIT 1
                ), false),
            COALESCE(
              (
                SELECT recurrence_value
                FROM items_todo
                WHERE LOWER(item_name) = LOWER(i_name)
                AND user_id = u_id
                ORDER BY date_updated DESC LIMIT 1
                ), NULL),
            COALESCE(
            (SELECT CAST (CURRENT_DATE + ('1 ' || recur)::INTERVAL AS DATE)), NULL)
          );
          RETURN true;
        ELSE
          RETURN false;
        END IF;
      END IF;
    END $$;
  `;
};

export default newTodoSql;
