// New Todo

export interface NewTodoReqInt {
  name: string;
}

export enum NewTodoReqEnum {
  name = "name",
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
