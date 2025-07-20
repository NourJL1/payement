
import { CustomerIdentityType } from './customer-identity-type';
import { CustomerDocListe } from './customer-doc-liste';
export class CustomerIdentity {
  cidCode?: number;
  cidNum?: string;
  cidIden?: string;

  customerIdentityType?: CustomerIdentityType;
  customerDocListe?: CustomerDocListe;

  constructor(init?: Partial<CustomerIdentity>) {
    this.customerDocListe = new CustomerDocListe()
    this.customerIdentityType = new CustomerIdentityType()
      Object.assign(this, init)
}

  isEmpty(): boolean {
    return !this.cidNum || this.cidNum.trim().length === 0;
  }
}
