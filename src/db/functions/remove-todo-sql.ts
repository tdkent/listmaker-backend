const removeTodoSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "removeTodo" 
  (i_id int, l_id int, u_id int)
  RETURNS bool LANGUAGE plpgsql AS
  $func$
  BEGIN
  IF NOT EXISTS (
    SELECT todo_item_id
    FROM items_todo
    WHERE todo_item_id = i_id
    AND list_id = l_id
    AND user_id = u_id
  )
  THEN
    RETURN false;
  ELSE
    DELETE FROM todo_subtasks
    WHERE todo_item_id = i_id;
    DELETE FROM items_todo
    WHERE todo_item_id = i_id;
    RETURN true;
  END IF;
  END;
  $func$;
  `;
};

export default removeTodoSql;
