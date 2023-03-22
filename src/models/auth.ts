export class NewUser {
  constructor(private readonly userEmail: string, private readonly userPassword: string) {}
}

export interface UserLoginInt {
  id: number;
  userEmail: string;
  userPassword: string;
}

export class UserData {
  constructor(
    private readonly userId: number,
    private readonly userEmail: string,
    private readonly token: string
  ) {}
}
