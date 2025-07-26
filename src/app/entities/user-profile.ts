import Module from "module";
import { UserProfileMenuOption } from "./user-profile-menu-option";
import { User } from "./user";

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
        Object.assign(this, init);
    }
}
