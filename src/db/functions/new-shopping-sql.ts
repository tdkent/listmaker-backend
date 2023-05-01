const newShoppingSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "newShopping"
      (l_id int, u_id int, i_name text)
    RETURNS bool LANGUAGE plpgsql AS 
    $func$
    DECLARE
    itemid int;
    isactive bool;
    ischecked bool;
    BEGIN
      IF NOT EXISTS
        (
          SELECT list_id
          FROM lists
          WHERE user_id = u_id
          AND list_id = l_id
          AND list_type = 'Shopping'
        )
      THEN
        RETURN false;
      ELSE
        itemid := (
          SELECT shop_item_id
          FROM items_shopping
          WHERE list_id = l_id
          AND item_name = i_name
        );
        IF itemid IS NULL THEN
          INSERT INTO items_shopping
            (list_id, user_id, item_name)
          VALUES (l_id, u_id, i_name);
          RETURN true;  
        ELSE
          isactive := (
            SELECT is_active
            FROM items_shopping
            WHERE shop_item_id = itemid
          );
          ischecked := (
            SELECT is_checked
            FROM items_shopping
            WHERE shop_item_id = itemid
          );
          IF (isactive = false) THEN
            UPDATE items_shopping
            SET is_active = true
            WHERE shop_item_id = itemid;
            RETURN true;
          ELSEIF (isactive = true AND ischecked = true)
          THEN
            UPDATE items_shopping
            SET
              is_checked = false,
              display_category = reference_category
            WHERE shop_item_id = itemid;
            RETURN true;
          ELSE
            RETURN true;
          END IF;
        END IF;
      END IF;
    END
    $func$;
  `;
};

export default newShoppingSql;
