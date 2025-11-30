export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body_html: string;
  created_at: string;
}

export interface AuthProps {
  setAuth: (auth: boolean) => void;
}

export interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  body_html: string;
}
