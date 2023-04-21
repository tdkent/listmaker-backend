// Shopping

export interface NewShopItemReqInt {
  name: string;
}

export enum NewShopItemReqEnum {
  name = "name",
}

export interface EditShopItemReqInt {
  name: string;
  category: string;
  isChecked: boolean;
}

export enum EditShopItemReqEnum {
  name = "name",
  category = "category",
  isChecked = "isChecked",
}

export enum DltShopItemReqEnum {
  listType = "listType",
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
