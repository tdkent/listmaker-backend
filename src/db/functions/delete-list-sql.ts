const deleteListSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "deleteList" (l_id int, u_id int)
  RETURNS bool LANGUAGE plpgsql AS
  $func$
  DECLARE
  type text;
  BEGIN
    type := (
      SELECT list_type
      FROM lists
      WHERE list_id = l_id
      AND user_id = u_id  
    );
    IF type IS NULL THEN
    RETURN false;
    ELSE
      IF (type = 'To-Do') THEN
        DELETE from todo_subtasks
        WHERE list_id = l_id;
        DELETE FROM items_todo
        WHERE list_id = l_id;
      ELSE
        DELETE FROM items_shopping
        WHERE list_id = l_id;
      END IF;
    DELETE FROM lists
    WHERE list_id = l_id;
    RETURN true;
    END IF;
  END;
  $func$;
  `;
};

export default deleteListSql;
