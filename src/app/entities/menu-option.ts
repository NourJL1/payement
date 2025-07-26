import Module from "module";
import { UserProfileMenuOption } from "./user-profile-menu-option";

export class MenuOption {

    code?: number
    identifier?: string
    label?: string
    parentOption?: MenuOption
    formName?: string
    module?: Module
    profileMenuOptions?: UserProfileMenuOption[]

    constructor(init?: Partial<MenuOption>) {
        Object.assign(this, init);
    }

}
