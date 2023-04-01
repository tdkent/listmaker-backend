# ListMaker Backend

## Codebase

#### Languages

- TypeScript
- Node

#### NPM Packages and Libraries Used

- Express
- Express Validator
- Slugify
- Bcrypt
- Jsonwebtoken
- PG
- Body-parser

#### TypeScript Extensions

- Node
- Express
- Bcrypt
- Jsonwebtoken

## Routes

- Note: unless otherwise specified, successful requests will receive a generic response:

```
{ "message": "OK" }
```

### <b>AUTH</b>

#### Register

<b>Request</b>

- Path: `.../auth/register`
- Method: `POST`
- Body:

```
{
  "userEmail": string,
  "userNickname": string,
  "userPassword": string,
}
```

#### Login

<b>Request</b>

- Path: `.../auth/login`
- Method: `POST`
- Body:

```
{
  "userEmail": string,
  "userPassword": string,
}
```

<b>Response</b>

```
{
"message": "OK",
"user":
  {
    "userId": number,
    "userEmail": string,
    "token": string
  }
}
```

### <b>USER</b>

#### Fetch Profile

<b>Request</b>

- Path: `.../user/profile`
- Method: `GET`
- Authorization: `Bearer Token`

<b>Response</b>

```
{
  "message": "OK",
  "user":
  {
    "id": number,
    "userEmail": string,
    "userNickname": string
  }
}
```

#### Edit Profile

<b>Request</b>

- Path: `.../user/profile`
- Method: `PATCH`
- Authorization: `Bearer Token`

### <b>LIST</b>

#### Fetch All Lists

<b>Request<b>

- Path: `.../list/fetch`
- Method: `GET`
- Authorization: `Bearer Token`

<b>Response</b>

```
{
  "message": "OK",
  "lists": [
    {
      "id": number,
      "userId": number,
      "name": string,
      "slug": string,
      "type": string
    }
  ]
}
```

#### Fetch Single List

<b>Request<b>

- Path: `.../list/fetch/:listId`
- Method: `GET`
- Authorization: `Bearer Token`

<b>Response</b>

```
{
  "message": "OK",
  "list":
    {
      "id": number,
      "userId": number,
      "name": string,
      "slug": string,
      "type": string
    }
}
```

#### New List

<b>Request</b>

- Path: `.../list/new`
- Method: `POST`
- Authorization: `Bearer Token`
- Body:

```
{
  name: string,
  type: string
}
```

#### Edit List

<b>Request</b>

- Path: `.../list/edit/:listId`
- Method: `PATCH`
- Authorization: `Bearer Token`
- Body:

```
{
  name: string,
}
```

#### Delete List

<b>Request</b>

- Path: `.../list/delete/:listId`
- Method: `DELETE`
- Authorization: `Bearer Token`

### <b>ITEM</b>

#### New Item

<b>Request</b>

- Path: `.../item/new/:listId`
- Method: `POST`
- Authorization: `Bearer Token`
- Body:

  - Type: SHOP

    ```
    {
      "name": string
    }
    ```

    Note: "isChecked" boolean (default `FALSE`) is automatically applied

#### Edit Item

<b>Request</b>

- Path: `.../item/:listId/:listType/:itemId`
- Method: `PATCH`
- Authorization: `Bearer Token`
- Body:

  - Type: SHOP

    ```
    {
      "name": string
    }
    ```

#### Check Item

"Check" or "uncheck" items in allowed list types

<b>Allowed List Types</b>

- shop
- todo

<b>Request</b>

- Path: `.../item/check/:listId/:listType/:itemId`
- Method: `PATCH`
- Authorization: `Bearer Token`

#### Delete Item

- Path: `.../item/:listId/:listType/:itemId`
- Method: `DELETE`
- Authorization: `Bearer Token`
