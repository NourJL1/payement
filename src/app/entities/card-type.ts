
import { Card } from './card';


export class CardType {

  ctypCode?: number;
  ctypIden?: string;
  ctypLabe?: string;
  cards?: Card[];

  constructor(init?: Partial<CardType>) {
    Object.assign(this, init);
  }
}
