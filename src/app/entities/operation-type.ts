

import { Wallet } from './wallet';
import { WalletOperationTypeMap } from './wallet-operation-type-map';
import { FeeSchema } from './fee-schema';
import { WalletCategoryOperationTypeMap } from './wallet-category-operation-type-map';
import { WalletCategory } from './wallet-category'

export class OperationType {

    optCode?: number;
  optIden!: string;
  optLabe!: string;

  optFscIden!: number;
  optFscLab!: string;

  wallet?: Wallet;
  walletOperationTypeMappings?: WalletOperationTypeMap[];
  feeSchema!: FeeSchema;
  walletCategoryOperationTypeMappings?: WalletCategoryOperationTypeMap[];
  walletCategory?: WalletCategory;

  constructor(init?: Partial<OperationType>) {
    Object.assign(this, init);
  }
}
