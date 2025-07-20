import { FeeRule } from './fee-rule';


export class FeeSchema {

    fscCode?: number;
  fscIden!: string;
  fscLabe!: string;
  feeRules?: FeeRule[];

  constructor(init?: Partial<FeeSchema>) {
    Object.assign(this, init);
  }
}
