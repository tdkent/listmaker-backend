const editShoppingSql = () => {
  return `
  CREATE OR REPLACE FUNCTION "editShopping"
      (i_id int, l_id int, u_id int, i_name text, i_cat text)
    RETURNS text LANGUAGE plpgsql AS
    $func$
    DECLARE
    ischecked bool;
    name text;
    BEGIN
    ischecked := (
      SELECT is_checked
      FROM items_shopping
      WHERE shop_item_id = i_id
      AND list_id = l_id
      AND user_id = u_id
    );
    name := (
      SELECT item_name
      FROM items_shopping
      WHERE LOWER(item_name) = LOWER(i_name)
      AND list_id = l_id
      AND shop_item_id != i_id 
    );
    IF ischecked IS NULL
    THEN
    RETURN 'ERR_NOT_FOUND';
    ELSEIF name IS NOT NULL
    THEN
      RETURN 'ERR_DUPLICATE_ITEM: ' || name;
    ELSE
      IF (ischecked = true)
      THEN
        UPDATE items_shopping
        SET
          item_name = i_name,
          reference_category = i_cat
        WHERE shop_item_id = i_id;
      ELSE
        UPDATE items_shopping
        SET
          item_name = i_name,
          reference_category = i_cat,
          display_category = i_cat
        WHERE shop_item_id = i_id;
      END IF;
    END IF;
    RETURN 'OK';
    END
    $func$;
  `;

  // return `
  // CREATE OR REPLACE FUNCTION "editShopping"
  //     (i_id int, l_id int, u_id int, i_name text, i_cat text)
  //   RETURNS bool LANGUAGE plpgsql AS
  //   $func$
  //   DECLARE
  //   ischecked bool;
  //   check text;
  //   BEGIN
  //   ischecked := (
  //     SELECT is_checked
  //     FROM items_shopping
  //     WHERE shop_item_id = i_id
  //     AND list_id = l_id
  //     AND user_id = u_id
  //   );
  //   IF ischecked IS NULL
  //   THEN
  //   RETURN false;
  //   ELSE
  //     IF (ischecked = true)
  //     THEN
  //       UPDATE items_shopping
  //       SET
  //         item_name = i_name,
  //         reference_category = i_cat
  //       WHERE shop_item_id = i_id;
  //     ELSE
  //       UPDATE items_shopping
  //       SET
  //         item_name = i_name,
  //         reference_category = i_cat,
  //         display_category = i_cat
  //       WHERE shop_item_id = i_id;
  //     END IF;
  //   END IF;
  //   RETURN true;
  //   END
  //   $func$;
  // `;
};

export default editShoppingSql;
