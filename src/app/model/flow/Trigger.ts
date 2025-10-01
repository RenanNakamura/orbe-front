export interface Trigger {

    type: TriggerType;

}

export enum TriggerType {
    WHATSAPP_KEYWORD = 'WHATSAPP_KEYWORD',
    WHATSAPP_STANDARD_FLOW = 'WHATSAPP_STANDARD_FLOW'
}

export interface WhatsAppKeyword {
    comparisonType: ComparisonType;
    words: string[];
}

export enum ComparisonType {

    START_WITH = 'START_WITH',
    CONTAINS = 'CONTAINS',
    EQUALS = 'EQUALS'

}