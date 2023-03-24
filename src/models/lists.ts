export enum ListTypesEnum {
  shop = "shopping",
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
