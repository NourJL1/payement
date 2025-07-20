


import { WalletCategoryOperationTypeMap } from './wallet-category-operation-type-map';
import { WalletOperationTypeMap } from './wallet-operation-type-map';

export class Periodicity {
     perCode?: number;
  perIden!: string;
  perLabe!: string;

  walletCategoryOperationTypeMaps?: WalletCategoryOperationTypeMap[];
  walletOperationTypeMaps?: WalletOperationTypeMap[];

  constructor(init?: Partial<Periodicity>) {
    Object.assign(this, init);
  }
}
