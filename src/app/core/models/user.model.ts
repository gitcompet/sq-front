export interface IUser {
  loginId: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
}
export class User implements IUser {
  loginId: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  constructor(
    loginId: string,
    login: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    this.loginId = loginId;
    this.login = login;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
