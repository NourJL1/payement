import { MenuOption } from "./menu-option";
import { UserProfile } from "./user-profile";

export class UserProfileMenuOption {
    
    id?: number
    profile?: UserProfile
    menuOption?: MenuOption
    canAccess?: boolean
    canInsert?: boolean
    canUpdate?: boolean
    canDelete?: boolean
    canEdit?: boolean
    canPrint?: boolean
    
    constructor(init?: Partial<UserProfileMenuOption>) {
        Object.assign(this, init);
    }

}
