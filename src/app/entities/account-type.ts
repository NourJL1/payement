import { Account } from './account';


export class AccountType {

  atyCode?: number;
  atyIden?: string;
  atyLabe?: string;
  atyFinId?: number;
  accounts?: Account[];

  constructor(init?: Partial<AccountType>) {
    Object.assign(this, init);
  }
}
