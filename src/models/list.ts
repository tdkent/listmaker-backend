// List Types
export enum AllListTypesEnum {
  shop = "Shopping",
  todo = "To-Do",
}

export enum CheckableListTypesEnum {
  shop = "Shopping",
  todo = "To-Do",
}

// New List
export interface NewListReqInt {
  listName: string;
  listType: AllListTypesEnum.shop | AllListTypesEnum.todo;
}

export enum NewListReqEnum {
  name = "listName",
  type = "listType",
}

export interface NewListResInt extends NewListReqInt {
  listId: number;
  userId: number;
  listSlug: string;
}

// Edit List
export interface EditListReqInt {
  listName: string;
}

export enum EditListReqEnum {
  name = "listName",
}
