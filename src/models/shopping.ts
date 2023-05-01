// New Item

export interface NewShopItemReqInt {
  itemName: string;
}

export enum NewShopItemReqEnum {
  name = "itemName",
}

// Check Item

export interface CheckShopItemReqInt {
  listId: number;
  itemId: number;
}

export enum CheckShopItemReqEnum {
  listId = "listId",
  itemId = "itemId",
}

// Edit Item

export interface EditShopItemReqInt {
  listId: number;
  itemId: number;
  itemName: string;
  itemCategory: string;
}

export enum EditShopItemReqEnum {
  listId = "listId",
  itemId = "itemId",
  name = "itemName",
  category = "itemCategory",
}

// Remove Item

export interface RemoveShopItemReqInt {
  listId: number;
  itemId: number;
}

export enum RemoveShopItemReqEnum {
  listId = "listId",
  itemId = "itemId",
}

// Fetch Item

export interface ShoppingItemInt {
  id: number;
  listId: number;
  userId: number;
  name: string;
  reference_category: string;
  display_category: string;
  isChecked: boolean;
  isActive: boolean;
}
