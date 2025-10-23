export interface CreateAgentRequest {
  name: string;
  email: string;
  role: AgentRole;
  status: AgentStatus;
}

export interface UpdateAgentRequest {
  name?: string;
  status?: AgentStatus;
}

export interface ListAgentResponse {
  id: string;
  tenantId: string;
  createdAt: string;
  name: string;
  email: string;
  role: AgentRole;
  status: AgentStatus;
}

export interface GetAgentResponse {
  id: string;
  tenantId: string;
  createdAt: string;
  name: string;
  email: string;
  role: AgentRole;
  status: AgentStatus;
  password: string;
}

export enum AgentStatus {

  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_INVITE = 'PENDING_INVITE'

}

export enum AgentRole {

  ADMIN = 'ADMIN',
  AGENT = 'AGENT',

}
