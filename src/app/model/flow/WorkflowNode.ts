import {Trigger} from './Trigger';
import {Message} from './Message';
import {Action} from './Action';
import {Condition} from './Condition';

export interface WorkflowNode {
    id: string;
    type: NodeType;
    position: NodePosition;
    target?: string;
}

export interface StartNode extends WorkflowNode {
    triggers: Trigger[];
}

export interface MessageNode extends WorkflowNode {
    messages: Message[];
}

export interface ButtonNode extends WorkflowNode {
    text: string;
    buttons: Button[];
}

export interface Button {
    id: string;
    text: string;
}

export interface ActionNode extends WorkflowNode {
    actions: Action[];
}

export interface ConditionNode extends WorkflowNode {
    operator: 'ALL' | 'ANY';
    conditions: Condition[];
}

export interface QuestionNode extends WorkflowNode {
    text: string;
    answerField: AnswerField;
}

export interface AnswerField {
    type: AnswerType;
    field: string;
}

export enum AnswerType {
    CONTACT = 'CONTACT', CUSTOM = 'CUSTOM'
}

export enum NodeType {
    START = 'START',
    MESSAGE = 'MESSAGE',
    QUESTION = 'QUESTION',
    BUTTON = 'BUTTON',
    LIST = 'LIST',
    ACTION = 'ACTION',
    CONDITION = 'CONDITION',
}

export interface NodePosition {
    x: number;
    y: number;
}
