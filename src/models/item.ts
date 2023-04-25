// New Item

export interface NewItemReqInt {
  name: string;
}

export enum NewItemReqEnum {
  name = "name",
}

// Shopping

export interface NewShoppingItemReqInt {
  name: string;
}

export enum NewShoppingItemReqEnum {
  name = "name",
}

export interface CheckShoppingItemReqInt {
  listId: number;
  itemId: number;
}

export enum CheckShoppingItemReqEnum {
  listId = "listId",
  itemId = "itemId",
}

export interface EditShopItemReqInt {
  listId: number;
  itemId: number;
  name: string;
  category: string;
}

export enum EditShopItemReqEnum {
  listId = "listId",
  itemId = "itemId",
  name = "name",
  category = "category",
}

export interface RemoveShopItemReqInt {
  listId: number;
  itemId: number;
}

export enum RemoveShopItemReqEnum {
  listId = "listId",
  itemId = "itemId",
}

// export enum DltShopItemReqEnum {
//   listType = "listType",
// }

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
