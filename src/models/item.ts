export interface ShoppingItemNewReqInt {
  name: string;
}

export enum ShoppingItemNewReqEnum {
  name = "name",
}

export interface ShoppingItemEditReqInt {
  name: string;
}

export enum ShoppingItemEditReqEnum {
  listType = "listType",
  name = "name",
}

export interface ShoppingItemInt {
  id: number;
  listId: number;
  userId: number;
  name: string;
  isChecked: boolean;
}

// TODO: add other item types to this type
export type SingleListItemTypes = ShoppingItemInt[];
