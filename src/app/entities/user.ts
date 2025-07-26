import { UserProfile } from "./user-profile"

export class User {

    code?: number
    login?: string
    password?: string
    firstName?: string
    middleName?: string
    lastName?: string
    function?: string
    statusCode?: number
    phone?: string
    fax?: string
    email?: string
    profile?: UserProfile

    get fullName(): string {
        return this.middleName ? this.firstName + ' ' + this.middleName + ' ' + this.lastName : this.firstName + ' ' + this.lastName;
      }
    
      constructor(init?: Partial<User>) {
        this.profile = new UserProfile();
        Object.assign(this, init);
      }

}
