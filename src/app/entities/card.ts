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
  carAmount?: number;
  carPlafond?: number;
  carPlafondPeriod?: string;

  constructor(init?: Partial<Card>) {
    Object.assign(this, init);
    
    // Ensure cardType is properly structured
    if (init?.cardType && typeof init.cardType === 'object') {
      this.cardType = init.cardType;
    } else if (init?.cardType) {
      // Handle case where cardType might be a string or other type
      this.cardType = { ctypLabe: init.cardType as any };
    }
  }
}