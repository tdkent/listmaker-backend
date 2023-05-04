const deleteSubtaskSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "deleteSubtask"
  (t_id int, i_id int, u_id int)
  RETURNS TABLE (tasks json)
  LANGUAGE plpgsql AS
  $func$
  BEGIN
  IF EXISTS (
    SELECT subtask_id
    FROM todo_subtasks
    WHERE subtask_id = t_id
    AND todo_item_id = i_id
    AND user_id = u_id
  ) THEN
    DELETE FROM todo_subtasks
    WHERE subtask_id = t_id;
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

export default deleteSubtaskSql;
