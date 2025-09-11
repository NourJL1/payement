

import { AccountList } from './account-list';
import { AccountType } from './account-type';
import { Bank } from './bank';

export class Account {

  accCode?: number;
  accRib?: string;
  accIden?: string;
  accKey?: string;
  accountList?: AccountList;
  accountType?: AccountType;
  bank?: Bank;
  accBalance?: number;

  constructor(init?: Partial<Account>) {
    Object.assign(this, init);
  }
}
