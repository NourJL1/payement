import { Wallet } from './wallet';
import { Account } from './account';

export class AccountList {

  aliCode?: number;
  aliIden?: string;
  aliLabe?: string;
  wallet?: Wallet | null;
  accounts?: Account[];

  constructor(init?: Partial<AccountList>) {
    Object.assign(this, init);
  }
}


