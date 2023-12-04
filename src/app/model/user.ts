import {Role} from "./role";

export class User {
  private _id: number;
  private _email: string;
  private _password: string;
  private _roles: Role[];

  constructor(id: number, email: string, password: string, roles: Role[]) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._roles = roles;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get roles(): Role[] {
    return this._roles;
  }

  set roles(value: Role[]) {
    this._roles = value;
  }
}
