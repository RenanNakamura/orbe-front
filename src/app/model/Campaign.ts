import {Template} from './Template';

export interface Campaign {
    id?: string;
    name: string;
    createdDate: string;
    finalizedDate: string;
    scheduling: string;
    status: Status;
    importStrategy: any;
    template: Template;
}

export interface CampaignContact {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    status?: string;
    campaignId?: string;
    error?: any;
}

export interface Column {

    type: ColumnType;
    index?: number;

}

export enum ColumnType {

    NAME = 'NAME',
    PHONE = 'PHONE',
    EMAIL = 'EMAIL'

}

export interface Parameter {
    component: ParameterComponent;
    type: ParameterType;
    number: number;
    fileNameStored?: string;
    fileName?: string;
    text?: string;
}

export enum ParameterComponent {
    HEADER = 'HEADER',
    BODY = 'BODY'
}

export enum ParameterType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    DOCUMENT = 'DOCUMENT',
    VIDEO = 'VIDEO'
}

export enum Status {

    PLANNING = 'PLANNING',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    FINISHED = 'FINISHED',
    SCHEDULED = 'SCHEDULED'

}

export interface CampaignParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
}

export interface CampaignContactParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    campaignId?: string;
    status?: string;
}

export interface CreateCampaign {
    name: string;
    template: Template;
    scheduling: string;
    parameters: Parameter[];
    importStrategy: any;
    phoneNumberId: string;
}

export interface CampaignDashboard {

    sentCount: number;
    deliveredCount: number;
    readCount: number;
    sendingCount: number;
    waitingCount: number;
    shootingErrorCount: number;
    invalidNumberCount: number;
    whatsAppNotExistCount: number;
    failedCount: number;

}

export function isParameterTypeMedia(type: ParameterType): boolean {
    return type === ParameterType.IMAGE ||
        type === ParameterType.VIDEO ||
        type === ParameterType.DOCUMENT;
}
