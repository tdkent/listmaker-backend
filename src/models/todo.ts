// New Item

export interface NewTodoReqInt {
  itemName: string;
}

export enum NewTodoReqEnum {
  name = "itemName",
}

// Check Item

export interface CheckTodoReqInt {
  listId: number;
  itemId: number;
}

export enum CheckTodoReqEnum {
  listId = "listId",
  itemId = "itemId",
}

// Edit Item

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
  isRecurring: boolean;
  recurInteger: string;
  recurInterval: string;
}

export enum EditTodoReqEnum {
  listId = "listId",
  itemId = "itemId",
  name = "itemName",
  location = "itemLocation",
  category = "itemCategory",
  date = "itemDate",
  time = "itemTime",
  recur = "isRecurring",
  integer = "recurInteger",
  interval = "recurInterval",
}

export const recurValArr = (n: number) => {
  let arr: string[] = [];
  for (let i = 0; i <= n; i++) {
    arr.push(i.toString());
  }
  return arr;
};

export enum RecurReqEnum {
  d = "day",
  ds = "days",
  w = "week",
  ws = "weeks",
  m = "month",
  ms = "months",
  y = "year",
  ys = "years",
}

// Remove Item

export interface RemoveTodoReqInt {
  listId: number;
  itemId: number;
}

export enum RemoveTodoReqEnum {
  list = "listId",
  item = "itemId",
}

// Subtasks

export interface NewSubtaskReqInt {
  itemId: number;
  taskName: string;
}

export enum NewSubtaskReqEnum {
  id = "itemId",
  name = "taskName",
}

export interface EditSubtaskReqInt {
  taskId: number;
  newName: string;
}

export enum EditSubtaskReqEnum {
  id = "taskId",
  name = "newName",
}

export interface CheckSubtaskReqInt {
  taskId: number;
  itemId: number;
}

export enum CheckSubtaskReqEnum {
  taskId = "taskId",
  itemId = "itemId",
}

export interface DeleteSubtaskReqInt {
  taskId: number;
}

export enum DeleteSubtaskReqEnum {
  id = "taskId",
}

export interface SubtaskInt {
  taskId: number;
  itemId: number;
  taskName: string;
  isChecked: boolean;
}

// Fetch Item

export interface TodoItemInt {
  id: number;
  listId: number;
  userId: number;
  name: string;
  category: string;
  dueDate: Date;
  isChecked: boolean;
  itemTasks: SubtaskInt[];
}
