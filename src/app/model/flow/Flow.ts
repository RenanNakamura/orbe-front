import {WorkflowNode} from './WorkflowNode';
import {Edge} from '@xyflow/react';
import {Message} from './Message';

export interface Flow {
    id?: string;
    createdDate: string;
    name: string;
    status: string;
    channel: { channelId: string, phoneNumberId: string };
    nodes: WorkflowNode[];
    edges: Edge[];
    viewport: any;
}

export interface CreateFlow {
    name: string;
    channelId: string;
    phoneNumberId: string;
}

export interface UpdateFlow {
    name: string;
    channelId: string;
    phoneNumberId: string;
}

export interface UpdateFlowNodes {
    id?: string;
    nodes: WorkflowNode[];
    edges: any[];
    viewport: any;
}

export interface FlowParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    flowId?: string;
}

export enum EdgeType {
    CUSTOM = 'CUSTOM'
}

export interface FlowExecution {
    id: string;
    contact: FlowContact;
    phone: string;
    phoneNumberId: string;
    createdDate: string;
    status: FlowExecutionStatus;
    logs: Log[];
}

export interface FlowContact {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
}

export enum FlowExecutionStatus {
    PENDING = 'PENDING',
    EXECUTION = 'EXECUTION',
    FINISHED = 'FINISHED',
    INTERRUPTED = 'INTERRUPTED'
}

export interface Log {
    createdDate: string;
    entry: Entry;
    messages: LogMessage[];
}

export interface LogMessage {
    createdDate: string;
    executedDate: string;
    status: Status;
    wamid: string;
    message: Message;
    error: any;
}

export enum Entry {
    COMMAND = 'COMMAND', RECEIVED = 'RECEIVED', SENT = 'SENT'
}

export enum Status {
    ON_HOLD = 'ON_HOLD',
    SENDING = 'SENDING',
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
    RECEIVED = 'RECEIVED',
    FAILED = 'FAILED',
    ERROR = 'ERROR'
}
