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
    
    // Ensure proper structure for nested objects
    if (init?.accountType && typeof init.accountType === 'object') {
      this.accountType = init.accountType;
    } else if (init?.accountType) {
      this.accountType = { atyLabe: init.accountType as any };
    }
    
    if (init?.bank && typeof init.bank === 'object') {
      this.bank = init.bank;
    } else if (init?.bank) {
      this.bank = { banCorpName: init.bank as any };
    }
  }
}