export enum ListTypesEnum {
  shop = "shop",
  todo = "todo",
}

export interface NewListReqInt {
  name: string;
  type: ListTypesEnum.shop | ListTypesEnum.todo;
}

export interface NewListResInt extends NewListReqInt {
  id: number;
  userId: number;
  slug: string;
}

export interface EditListReqInt {
  name: string;
}
