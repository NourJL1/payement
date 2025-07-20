

import { Wallet } from './wallet';              // Assure-toi que ce fichier existe
import { OperationDetails } from './operation-details'; // Assure-toi que ce fichier existe
import { Customer } from './customer';          // Assure-toi que ce fichier existe
export class WalletOperations {
 wopCode!: number;
  wopIden!: string;
  wallet!: Wallet;
  wopOtyCode!: number;
  wopAmount!: number;
  wopCurrency!: string;
  wopStatus!: string;
  wopLabel?: string;
  wopTimestamps?: Date;
  operationDetails?: OperationDetails[];
  customer?: Customer;

  constructor(init?: Partial<WalletOperations>) {
    Object.assign(this, init);
  }
}
