export type Role = 'ADMIN' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}
