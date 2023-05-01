const deleteTableSQl = () => {
  return `
  CREATE OR REPLACE FUNCTION "deleteTable" (l_id int, u_id int)
  RETURNS bool LANGUAGE plpgsql
  AS $$
  DECLARE
  type text;
  BEGIN
    type := (SELECT list_type FROM lists WHERE list_id = l_id);
    IF (type = 'To-Do') THEN
      DELETE FROM items_todo
      WHERE list_id = l_id
      AND user_id = u_id;
    ELSE
      DELETE FROM items_shopping
      WHERE list_id = l_id
      AND user_id = u_id;
    END IF;
    DELETE FROM lists
    WHERE list_id = l_id
    AND user_id = u_id;
    RETURN FOUND;
  END
  $$;
  `;
};

export default deleteTableSQl;
