import {Role} from '../model/User';

export class RoleUtil {

    static hasRole(roles: Role[], role: Role): boolean {
        if (!roles?.length) {
            return true;
        }
        return !!roles?.find(r => r === role);
    }

}
