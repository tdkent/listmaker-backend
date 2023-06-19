const newSubtaskSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "newSubtask"
  (i_id int, l_id int, u_id int, t_name text)
  RETURNS TABLE (tasks json)
  LANGUAGE plpgsql AS
  $func$
  DECLARE
  ischecked bool;
  BEGIN
  ischecked := (
    SELECT is_checked
    FROM items_todo
    WHERE todo_item_id = i_id
    AND list_id = l_id
    AND user_id = u_id 
  );
  IF ischecked IS NOT NULL
  THEN
    INSERT INTO todo_subtasks
      (todo_item_id, list_id, user_id, task_name, is_checked)
    VALUES (i_id, l_id, u_id, t_name, ischecked);
    RETURN QUERY
    SELECT json_agg(json_build_object(
            'taskId', subtask_id,
            'itemId', todo_item_id,
            'taskName', task_name,
            'isChecked', is_checked
        )) tasks
    FROM todo_subtasks
    WHERE todo_item_id = i_id;
  ELSE
    RETURN;
  END IF;
  END;
  $func$;
  `;
};

export default newSubtaskSql;
