export interface IUser {
  login: string;
  email: string;
  firsName: string;
  lastName: string;
}
export class User implements IUser {
  login: string;
  email: string;
  firsName: string;
  lastName: string;
  constructor(
    login: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    this.login = login;
    this.email = email;
    this.firsName = firstName;
    this.lastName = lastName;
  }
}
