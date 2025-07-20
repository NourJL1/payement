
import { Wallet } from './wallet';


export class WalletBalanceHistory {

    wbhCode?: number;
  wbhIden?: string;
  wbhEffBal?: number;
  wbhLogicBalance?: number;
  wbhSpecificBalance?: number;
  wbhLastUpdated?: Date;
  wallet?: Wallet;

  constructor(init?: Partial<WalletBalanceHistory>) {
    Object.assign(this, init);
  }
}
