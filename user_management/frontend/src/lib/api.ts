import axios from 'axios';
import type { User, EmailTemplate, LoginFormData, RegisterFormData, EmailTemplateFormData } from '../types';

export const API_URL = "http://localhost:8000";

// Configure axios interceptor for JWT
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (credentials: LoginFormData) => {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    const response = await axios.post(`${API_URL}/token`, params);
    return response.data;
  },

  register: async (userData: RegisterFormData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },
};

// Email Templates API
export const emailTemplatesApi = {
  getAll: async (): Promise<EmailTemplate[]> => {
    const response = await axios.get(`${API_URL}/email-templates`);
    return response.data;
  },

  create: async (template: EmailTemplateFormData): Promise<EmailTemplate> => {
    const response = await axios.post(`${API_URL}/email-templates`, template);
    return response.data;
  },

  testSend: async (templateId: number, toEmail: string, variables: Record<string, string>) => {
    const response = await axios.post(`${API_URL}/email/test-send`, {
      template_id: templateId,
      to_email: toEmail,
      variables: variables
    });
    return response.data;
  },
};

// Email Logs API
export const emailLogsApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/email/logs`);
    return response.data;
  },
};
