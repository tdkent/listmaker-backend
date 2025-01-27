# ListMaker REST API

## Description

[ListMaker](https://mylistmaker.netlify.com) is a free-to-use web application for creating lists to stay organized and productive. After creating a free account, users can add lists to their private account. ListMaker features two list types: Shopping and To-Do.

This repository contains the codebase for the application's REST API. The API handles requests made over `HTTP`, including user authentication and CRUD actions, as well as managing the application's database.

---

## Features

- Token-based authentication
- Handles all `GET`, `POST`, `PATCH`, and `DELETE` requests made over `HTTP`
- Validates all incoming requests with `express-validator`
- Robust error handling
- Geocodes incoming location data with the `Google Geocode API`
- Handles complex database actions with `PostgreSQL` functions

<details>
<summary>View example function</summary>

```sql
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
```

</details>

---

## Built with

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Axios
- express-validator
- node-postgres

---
