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
  name: string;
  type: AllListTypesEnum.shop | AllListTypesEnum.todo;
}

export enum NewListReqEnum {
  name = "name",
  type = "type",
}

export interface NewListResInt extends NewListReqInt {
  id: number;
  userId: number;
  slug: string;
}

// Edit List
export interface EditListReqInt {
  name: string;
}

export enum EditListReqEnum {
  name = "name",
}
