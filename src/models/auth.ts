export interface UserRegisterReqInt {
  userEmail: string;
  userNickname: string;
  userPassword: string;
}

export enum UserRegisterReqEnum {
  email = "userEmail",
  name = "userNickname",
  pass = "userPassword",
}

export interface UserLoginInt {
  userEmail: string;
  userPassword: string;
}

export enum UserLoginReqEnum {
  email = "userEmail",
  pass = "userPassword",
}

export interface UserDataInt extends UserLoginInt {
  userId: number;
  userNickname: string;
}
