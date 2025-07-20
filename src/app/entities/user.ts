import { Role } from './role';
import { Wallet } from './wallet';
export class User {
  id: number;
  username: string;
  password: string;
  fullname: string;
  phoneNbr: string;
  email: string | null;
  roles: Role[]; // Roles are represented as an array of Role objects
  wallet?: Wallet;

  constructor(
    id: number,
    username: string,
    password: string,
    fullname: string,
    phoneNbr: string,
    email: string | null,
    roles: Role[],
    wallet: Wallet,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.phoneNbr = phoneNbr;
    this.email = email;
    this.roles = roles;
    this.wallet = wallet;
  }
}
