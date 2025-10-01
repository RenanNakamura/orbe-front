export interface PhoneNumberInfo {
    id: string;
    /**
     * Nome exibido nos cabeçalhos de tópicos de bate-papo e perfil do WhatsApp.
     */
    verified_name: string;
    display_phone_number: string;
    code_verification_status: string;
    status: string;
    name_status: string;
    health_status: HealthStatus;
    /**
     * Indica se a conta é um perfil oficial verificado ("selo azul").
     */
    is_official_business_account: string;
    /**
     * Data/hora em que o número foi adicionado à conta do WhatsApp Business.
     */
    last_onboarded_time: string;
    /**
     * Limite de mensagens liberadas ao número comercial do WhatsApp.
     */
    messaging_limit_tier: string;
    quality_rating: string;
}

export interface HealthStatus {
    /**
     * Status geral de integridade: BLOCKED, LIMITED ou AVAILABLE.
     */
    can_send_message: string;
    entities: Entities[];
}

export interface Entities {
    /**
     * Tipo da entidade: PHONE_NUMBER, TEMPLATE, WABA, BUSINESS, APP.
     */
    entity_type: string;
    /**
     * ID da entidade conforme o tipo.
     */
    id: string;
    /**
     * Status de envio de mensagens: AVAILABLE, LIMITED, BLOCKED.
     */
    can_send_message: string;
    /**
     * Info adicional quando status for LIMITED.
     */
    additional_info: string[];
    /**
     * Lista de erros quando status for BLOCKED.
     */
    errors: HealthStatusError[];
}

export interface HealthStatusError {
    error_code: string;
    error_description: string;
    possible_solution: string;
}
