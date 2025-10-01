export interface Channel {
    id?: string;
    name: string;
    phoneNumberId: string;
    wabaId: string;
    applicationId: string;
    accessToken: string;
    phoneNumberInfo: any;
    creationType: ChannelCreationType;
}

export interface ChannelParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
}

export interface ChannelWithFacebookEmbeddedSignup {
    wabaId: string;
    phoneNumberId: string;
    code: string;
}

export enum ChannelCreationType {
    MANUAL = 'MANUAL', // Cadastro pela tela
    FACEBOOK = 'FACEBOOK' // Cadastro incorporado do Facebook
}
