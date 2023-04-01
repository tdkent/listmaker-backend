export enum ListTypesEnum {
  shop = "shop",
  todo = "todo",
}

export interface NewListReqInt {
  name: string;
  type: ListTypesEnum.shop | ListTypesEnum.todo;
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

export enum CheckTypesEnum {
  shop = "shop",
  todo = "todo",
}
