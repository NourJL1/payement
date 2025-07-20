

import { WalletOperations } from './wallet-operations';

export class OperationDetails {

     odeCode?: number;
  odeCusCode!: number;
  odeIden!: string;
  odeType!: string;
  odeValue!: string;
  odeFeeAmount?: number;
  odePayMeth!: string;
  odeRecipientWallet!: string;
  odeCreatedAt!: Date;
  walletOperation!: WalletOperations;

  constructor(init?: Partial<OperationDetails>) {
    Object.assign(this, init);
  }
}
