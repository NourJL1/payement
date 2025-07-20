4

import { CardType } from './card-type';
import { CardList } from './card-list';
export class Card {

  carCode?: number;
  carNumb?: string;
  carIden?: string;
  carExpiryDate?: Date;
  carEmvData?: string;
  carLabe?: string;
  cardType?: CardType;
  cardList?: CardList;

  constructor(init?: Partial<Card>) {
    Object.assign(this, init);
  }
}
