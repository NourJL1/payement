
import { Wallet } from './wallet';
import { WalletCategoryOperationTypeMap } from './wallet-category-operation-type-map';


export class WalletCategory {

  wcaCode?: number;
  wcaIden!: string;
  wcaLabe!: string;
  wcaFinId!: number;

  wallets?: Wallet[];

  walletCategoryOperationTypeMappings?: WalletCategoryOperationTypeMap[];

  constructor(init?: Partial<WalletCategory>) {
    Object.assign(this, init);
  }
}
