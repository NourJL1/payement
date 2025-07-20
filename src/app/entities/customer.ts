import { Role } from './role';
import { CustomerContacts } from './customer-contacts';
import { CustomerStatus } from './customer-status';
import { CustomerIdentity } from './customer-identity';
import { City } from './city';
import { Country } from './country';
import { Wallet } from './wallet';
import { WalletOperations } from './wallet-operations';

export class Customer {
  cusCode?: number;
  cusFirstName?: string;
  cusMidName?: string;
  cusLastName?: string;
  cusMailAddress?: string;
  cusMotDePasse?: string;
  cusPhoneNbr?: string;
  cusAddress?: string;
  cusIden?: string;
  cusFinId?: number;
  contacts?: CustomerContacts[];
  status?: CustomerStatus;
  identity?: CustomerIdentity;
  city?: City;
  country?: Country;
  wallet?: Wallet;
  walletOperations?: WalletOperations[];
  username?: string;
  role?: Role;
  roles?: Role[];
  createdAt?: string;

  get fullName(): string {
    return this.cusMidName ? this.cusFirstName + ' ' + this.cusMidName + ' ' + this.cusLastName : this.cusFirstName + ' ' + this.cusLastName;
  }

  constructor(init?: Partial<Customer>) {
    this.identity = new CustomerIdentity();
    this.wallet = new Wallet();
    Object.assign(this, init);
  }
}