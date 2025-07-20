

import { Wallet } from './wallet';
import { Card } from './card';
export class CardList {

  cliCode?: number;
  cliIden?: string;
  cliLabe?: string;
  wallet?: Wallet;
  cards?: Card[];

  constructor(init?: Partial<CardList>) {
    Object.assign(this, init);
  }


}
