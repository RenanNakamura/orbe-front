import {Field, Type} from '../../../model/flow/Condition';

export class ConditionConst {

    public static getAllConditions() {
        return [
            {value: Type.EMPTY, label: 'conditions.empty'},
            {value: Type.NOT_EMPTY, label: 'conditions.notEmpty'},
            {value: Type.CONTAINS, label: 'conditions.contains'},
            {value: Type.NOT_CONTAINS, label: 'conditions.notContains'},
            {value: Type.EQUAL, label: 'conditions.equals'},
            {value: Type.NOT_EQUAL, label: 'conditions.notEquals'},
            {value: Type.START_WITH, label: 'conditions.startWith'},
        ];
    }

    public static getConditionsForPhone() {
        return [
            {value: Type.CONTAINS, label: 'conditions.contains'},
            {value: Type.NOT_CONTAINS, label: 'conditions.notContains'},
            {value: Type.EQUAL, label: 'conditions.equals'},
            {value: Type.NOT_EQUAL, label: 'conditions.notEquals'},
            {value: Type.START_WITH, label: 'conditions.startWith'},
        ];
    }

    public static getConditionsForTag() {
        return [
            {value: Type.CONTAINS, label: 'conditions.contains'},
            {value: Type.NOT_CONTAINS, label: 'conditions.notContains'},
        ];
    }

    public static getFields() {
        return [
            {value: Field.name, label: 'name'},
            {value: Field.phone, label: 'phone'},
            {value: Field.email, label: 'email'},
            {value: Field.tag, label: 'tag'},
            {value: Field.address, label: 'address'},
        ];
    }
}
