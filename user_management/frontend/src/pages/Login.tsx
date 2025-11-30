import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import type { AuthProps, LoginFormData } from '../types';
import { authApi } from '../lib/api';
import { Button, Input, Card } from '../components/ui';

export const Login: React.FC<AuthProps> = ({ setAuth }) => {
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await authApi.login(formData);
      localStorage.setItem('token', data.access_token);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Welcome Back</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button type="submit" variant="primary" className="w-full">
            <LogIn className="w-4 h-4 mr-2" /> Login
          </Button>
        </form>
      </Card>
    </div>
  );
};
