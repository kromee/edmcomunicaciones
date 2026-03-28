export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
};
