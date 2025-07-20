
import { CustomerDocListe } from './customer-doc-liste';
import { DocType } from './doc-type';

export class CustomerDoc {

  cdoCode?: number;
  cdoIden?: string;
  cdoLabe?: string;
  customerDocListe?: CustomerDocListe;
  docType?: DocType;

  constructor(init?: Partial<CustomerDoc>) {
    Object.assign(this, init);
  }
}
