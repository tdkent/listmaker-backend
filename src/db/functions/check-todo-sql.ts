const checkTodoSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "checkTodo" 
  (i_id int, l_id int, u_id int)
RETURNS bool LANGUAGE plpgsql AS
$func$
DECLARE
ischecked bool;
isrecur bool;
BEGIN
ischecked := (
  SELECT is_checked
  FROM items_todo
  WHERE todo_item_id = i_id
  AND list_id = l_id
  AND user_id = u_id
);
isrecur := (
  SELECT is_recurring
  FROM items_todo
  WHERE todo_item_id = i_id
  AND list_id = l_id
  AND user_id = u_id
);
IF ischecked IS NULL THEN
RETURN false;
ELSE
  IF (ischecked = false) THEN
    UPDATE items_todo
    SET
      is_checked = true,
      date_completed = CURRENT_DATE
    WHERE todo_item_id = i_id;
    UPDATE todo_subtasks
    SET is_checked = true
    WHERE todo_item_id = i_id;

    IF (isrecur = true) THEN
      INSERT INTO items_todo
        (
          list_id,
          user_id,
          item_name,
          item_category,
          item_location,
          time_due,
          is_recurring,
          recurrence_value
        )
      SELECT
        l_id,
        u_id,
        item_name,
        item_category,
        item_location,
        time_due,
        true,
        recurrence_value
      FROM items_todo
      WHERE todo_item_id = i_id;
    END IF;
  
  ELSE
    UPDATE items_todo
    SET
      is_checked = false,
      date_completed = NULL
    WHERE todo_item_id = i_id;
    UPDATE todo_subtasks
    SET is_checked = false
    WHERE todo_item_id = i_id;
  END IF;
RETURN true;
END IF;
END;
$func$;
  `;
};

export default checkTodoSql;
