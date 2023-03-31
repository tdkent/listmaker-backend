export interface UserProfileResInt {
  id: number;
  userEmail: string;
  userNickname: string;
}

export interface EditUserProfileInt {
  userNickname: string;
}

export enum EditUserProfileEnum {
  name = "userNickname",
}
