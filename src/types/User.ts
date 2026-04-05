export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'banned';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  avatar?: string;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
}
