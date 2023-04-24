// New Item

export interface NewItemReqInt {
  name: string;
}

export enum NewItemReqEnum {
  name = "name",
}

// Shopping

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
  perm_category: string;
  temp_category: string;
  isChecked: boolean;
  isActive: boolean;
}

export interface TodoItemInt {
  id: number;
  listId: number;
  userId: number;
  name: string;
  category: string;
  dueDate: Date;
  isChecked: boolean;
}

// TODO: add other item types to this type
export type SingleListItemTypes = (ShoppingItemInt | TodoItemInt)[];
