import { MenuOption } from "./menu-option";
import { UserProfile } from "./user-profile";

export class Module {

    code?: number
    identifier?: string
    label?: string
    logo?: string
    isMenu?: boolean
    accessPath?: string
    order?: number
    parentModule?: Module
    profiles?: UserProfile[]
    menuOptions?: MenuOption[]

    constructor(init?: Partial<Module>) {
        Object.assign(this, init);
    }

}
