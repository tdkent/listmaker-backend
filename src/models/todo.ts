// New Todo

export interface NewTodoReqInt {
  itemName: string;
}

export enum NewTodoReqEnum {
  name = "itemName",
}

// Check Todo

export interface CheckTodoReqInt {
  listId: number;
  itemId: number;
}

export enum CheckTodoReqEnum {
  listId = "listId",
  itemId = "itemId",
}
