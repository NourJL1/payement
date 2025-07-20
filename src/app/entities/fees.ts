
import { WalletCategoryOperationTypeMap } from './wallet-category-operation-type-map';
import { WalletOperationTypeMap } from './wallet-operation-type-map';
export class Fees {

    feeCode?: number;
  feeIden?: string;
  feeLabel?: string;
  feeMinLimit?: number;
  feeAmount?: number;
  feeMaxLimit?: number;
  feePercentage?: string;
  feeMaxAmount?: number;
  financialInstitutionId?: number;

  walletCategoryOperationTypeMaps?: WalletCategoryOperationTypeMap[];
  walletOperationTypeMaps?: WalletOperationTypeMap[];

  constructor(init?: Partial<Fees>) {
    Object.assign(this, init);
  }
}
