
import { CustomerIdentity } from './customer-identity';

export class CustomerIdentityType {

     citCode?: number;
  citIden?: string;
  citLabe?: string;

  customerIdentities?: CustomerIdentity[];

  constructor(init?: Partial<CustomerIdentityType>) {
    Object.assign(this, init);
  }
}
