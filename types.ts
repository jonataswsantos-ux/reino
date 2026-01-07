
export enum UserRole {
  ADMIN = 'ADMIN', // Gestor da Filial
  VIEWER = 'VIEWER' // Consulta de Relatórios
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING'
}

export interface Branch {
  id: string;
  name: string;
  city: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  branchId: string;
  status: UserStatus;
  verificationCode?: string;
  profileImage?: string;
  isMaster?: boolean; // Este será o ADM GERAL
}

export interface MeetingRecord {
  id: string;
  date: string;
  time: string;
  totalPeople: number;
  decisions: number;
  visitors: number;
  kidsVisitors: number;
  branchId: string;
  timestamp: number;
}

export interface AuthState {
  user: User | null;
  activeBranchId: string | null;
}
