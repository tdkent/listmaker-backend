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
        i_time time,
        b_recur bool,
        i_recur text,
        r_date date
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
            is_recurring = b_recur,
            recurrence_value = CASE
              b_recur WHEN true THEN i_recur ELSE NULL END,
            date_recurrence = CASE
              b_recur WHEN true THEN (SELECT CAST (i_date + ('1 week')::INTERVAL AS DATE)) ELSE NULL END,
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
            is_recurring = b_recur,
            recurrence_value = CASE
              b_recur WHEN true THEN i_recur ELSE NULL END,
            date_recurrence = CASE
              b_recur WHEN true THEN r_date ELSE NULL END,
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
            is_recurring = b_recur,
            recurrence_value = CASE
              b_recur WHEN true THEN i_recur ELSE NULL END,
            date_recurrence = CASE
              b_recur WHEN true THEN r_date ELSE NULL END,
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
            is_recurring = b_recur,
            recurrence_value = CASE
              b_recur WHEN true THEN i_recur ELSE NULL END,
            date_recurrence = CASE
              b_recur WHEN true THEN r_date ELSE NULL END,
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
