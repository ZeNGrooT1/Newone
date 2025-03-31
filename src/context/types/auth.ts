
import { type Profile } from '@/integrations/supabase/client';

export type Role = 'student' | 'driver' | 'coordinator' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  usn?: string;
  phone?: string;
  region?: string;
}

export interface LoginCredentials {
  identifier: string; // USN for students, phone for others
  password: string;
  role: Role;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  usn?: string;
  phone?: string;
  region?: string;
  agreeToTerms: boolean;
  profilePhoto?: File;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: Role;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isLoading: boolean;
  forgotPassword: (identifier: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  navigateToRoleDashboard: (role: Role) => void;
}
