import { Wallet } from "./wallet";

export class WalletStatus {

   wstCode!: number;
  wstIden!: string;
  wstLabe!: string;
  wallets?: Wallet[]; // Optional to prevent circular reference issues

  constructor(init?: Partial<WalletStatus>) {
    Object.assign(this, init);
  }
}
