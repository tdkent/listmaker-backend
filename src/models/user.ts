export interface UserProfileDbInt {
  userEmail: string;
  userNickname: string;
}

export interface UserProfileInt extends UserProfileDbInt {
  userId: number;
}

export interface EditUserProfileInt {
  userNickname: string;
}
