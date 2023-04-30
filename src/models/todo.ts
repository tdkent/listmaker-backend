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

// Edit Todo

export enum TodoCatsEnum {
  home = "Home",
  work = "Work",
  appoint = "Appointment",
  errand = "Errand",
}

export interface EditTodoReqInt {
  listId: number;
  itemId: number;
  itemName: string;
  itemCategory: string;
  itemLocation: string;
  itemDate: string;
  itemTime: string;
}

export enum EditTodoReqEnum {
  listId = "listId",
  itemId = "itemId",
  name = "itemName",
  location = "itemLocation",
  category = "itemCategory",
  date = "itemDate",
  time = "itemTime",
}

// Remove Todo

export interface RemoveTodoReqInt {
  listId: number;
  itemId: number;
}

export enum RemoveTodoReqEnum {
  listId = "listId",
  itemId = "itemId",
}
