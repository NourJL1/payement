export class CustomerStatus {

     ctsCode?: number;
  ctsIden?: string;
  ctsLabe?: string;

  constructor(init?: Partial<CustomerStatus>) {
    Object.assign(this, init);
  }
}
