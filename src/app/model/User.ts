import {Language} from './sk/Language';

export interface LoggedUser {
    name: string;
    role: Role;
    language: Language;
    plan: PlanEnum;
}

export interface User {

    id: string;
    name: string;
    email: string;
    password: string;
    status: Status;
    ddi: string;
    number: string;
    language: Language;
    applicationId: string;
    phoneNumberId: string;

}

export enum Role {

    ADMIN = 'ADMIN',
    USER = 'USER'

}

export enum PlanEnum {

    BASIC = 'BASIC',
    PRO = 'PRO'

}

export enum Status {

    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'

}

export interface UserParams {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
}

export interface Onboarding {
    createdAt: string;
    updatedAt: string;
    gateway: string;
    status: OnboardingStatus;
    token: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    plan: Plan;
    accessAllowedDate: string;
}

export enum OnboardingStatus {
    PENDING = 'PENDING', FINISHED = 'FINISHED'
}

export interface Plan {
    id: string;
    plan: string;
    maxChannelCount: string;
}

export interface FinishOnboarding {
    name: string;
    phone: string;
    email: string;
    language: Language;
    gateway: string;
    plan: string;
    maxChannelCount: number;
    password: string;
}
