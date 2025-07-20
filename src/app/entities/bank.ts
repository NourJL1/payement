

import { Account } from './account';

export class Bank {


  banCode?: number;
  banIden?: string;
  banCorpName?: string;
  banInit?: string;
  banFinId?: number;
  accounts?: Account[];

  constructor(init?: Partial<Bank>) {
    Object.assign(this, init);
  }
}
