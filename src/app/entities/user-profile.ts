import { UserProfileMenuOption } from "./user-profile-menu-option";
import { User } from "./user";
import { Module } from "./module";

export class UserProfile {
    code?: number
    identifier?: string
    label?: string
    viewBank?: boolean
    viewBranch?: boolean
    viewChild?: boolean
    viewCustomerMerchant?: boolean
    grantPermission?: boolean
    canDecryptPan?: boolean
    users?: User[]
    modules?: Module[]
    profileMenuOptions?: UserProfileMenuOption[]

    constructor(init?: Partial<UserProfile>) {
        this.modules = []
        Object.assign(this, init);
    }
}
