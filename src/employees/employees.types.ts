export enum EmployeeRole {
  IT_HELP = 'IT_HELP', // L1 helpdesk
  SYSTEM = 'SYSTEM', // systems engineer
  NETWORK = 'NETWORK', // network engineer
  SRE = 'SRE', // oncall / high severity
  HR = 'HR',
}

export enum EmployeeLevel {
  L1 = 1,
  L2 = 2,
  L3 = 3,
}

export interface Employee {
  id: string;
  name: string;
  email: string;

  role: EmployeeRole;
  level: EmployeeLevel;

  active: boolean; // still employed / enabled
  onCall: boolean; // currently on-call (later can be schedule-driven)

  createdAt: string;
  updatedAt: string;
}
