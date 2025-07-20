import { CustomerDoc } from './customer-doc';  // adjust the import path as needed


export class DocType {

    dtyCode?: number;
  dtyIden?: string;
  dtyLabe?: string;
  customerDocs?: CustomerDoc[];

  constructor(init?: Partial<DocType>) {
    Object.assign(this, init);
  }
}
