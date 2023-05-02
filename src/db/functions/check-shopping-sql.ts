const checkShoppingSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "checkShopping"
      (i_id int, l_id int, u_id int)
    RETURNS bool LANGUAGE plpgsql AS
    $func$
    DECLARE
    ischecked bool;
    BEGIN 
      ischecked := (
        SELECT is_checked
        FROM items_shopping
        WHERE shop_item_id = i_id
        AND list_id = l_id
        AND user_id = u_id
      );
      IF ischecked IS NULL
      THEN
      RETURN false;
      ELSE
        IF (ischecked = false) THEN
          UPDATE items_shopping
          SET
            is_checked = NOT is_checked,
            display_category = '_checked'
          WHERE shop_item_id = i_id;
        ELSE
          UPDATE items_shopping
          SET
            is_checked = NOT is_checked,
            display_category = reference_category
          WHERE shop_item_id = i_id;
        END IF;
      END IF;
      RETURN true;
    END
    $func$;
  `;
};

export default checkShoppingSql;
