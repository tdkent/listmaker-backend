export enum AllListTypesEnum {
  shop = "shopping",
  todo = "todo",
}

export enum CheckableListTypesEnum {
  shop = AllListTypesEnum.shop,
  todo = AllListTypesEnum.todo,
}

export interface NewListReqInt {
  name: string;
  type: AllListTypesEnum.shop | AllListTypesEnum.todo;
}

export enum NewListReqFieldsEnum {
  name = "name",
  type = "type",
}

export interface NewListResInt extends NewListReqInt {
  id: number;
  userId: number;
  slug: string;
}

export interface EditListReqFieldsInt {
  name: string;
}

export enum EditListReqFieldsEnum {
  name = "name",
}
