export interface UserProfileDbInt {
  userEmail: string;
  userNickname: string;
}

export interface UserProfileInt extends UserProfileDbInt {
  userId: number;
}
