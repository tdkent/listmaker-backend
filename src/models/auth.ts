export interface UserRegisterInt {
  userEmail: string;
  userNickname: string;
  userPassword: string;
}

export interface UserLoginInt {
  userEmail: string;
  userPassword: string;
}

export interface UserDataInt extends UserLoginInt {
  id: number;
}

export class UserData {
  constructor(
    public readonly userId: number,
    public readonly userEmail: string,
    public readonly token: string
  ) {}
}
