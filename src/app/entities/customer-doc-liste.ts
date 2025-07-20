
import { CustomerDoc } from './customer-doc';

export class CustomerDocListe {

  cdlCode?: number;
  cdlIden?: string;
  cdlLabe?: string;
  customerDocs?: CustomerDoc[];

  constructor(init?: Partial<CustomerDocListe>) {
    this.customerDocs = [];
    Object.assign(this, init);
  }
}
