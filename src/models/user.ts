export interface UserProfileResInt {
  id: number;
  userEmail: string;
  userNickname: string;
}

export interface EditNicknameInt {
  userNickname: string;
}

export enum EditNicknameEnum {
  name = "userNickname",
}
