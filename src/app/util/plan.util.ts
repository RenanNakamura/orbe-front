import {PlanEnum} from '../model/User';

export class PlanUtil {

    static hasPlan(plans: PlanEnum[], plan: PlanEnum): boolean {
        if (!plans?.length) {
            return true;
        }
        return !!plans?.find(r => r === plan);
    }

}
