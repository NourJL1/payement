import { Wallet } from "./wallet";

export class WalletType {

  wtyCode!: number;
  wtyIden!: string;
  wtyLabe!: string;
  wallets?: Wallet[]; // Optional to avoid circular JSON issues

  constructor(init?: Partial<WalletType>) {
    Object.assign(this, init);
  }
}
