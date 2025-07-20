import { Customer } from './customer';

export class CustomerContacts {

     ccoCode?: number;
  ccoIden?: string;
  ccoContactName?: string;
  ccoContactMail?: string;
  ccoContactPhone?: string;
  ccoAddedAt?: Date;
  ccoLastInteraction?: Date;
  customer?: Customer;

  constructor(init?: Partial<CustomerContacts>) {
    Object.assign(this, init);
  }
}
