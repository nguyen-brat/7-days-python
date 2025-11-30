import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import type { RegisterFormData } from '../types';
import { authApi } from '../lib/api';
import { Button, Input, Card } from '../components/ui';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await authApi.register(formData);
      setMsg('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setMsg('Error: ' + (err.response?.data?.detail || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Create Account</h2>
        {msg && (
          <div
            className={`p-2 mb-4 rounded ${
              msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button type="submit" variant="secondary" className="w-full">
            <UserPlus className="w-4 h-4 mr-2" /> Register
          </Button>
        </form>
      </Card>
    </div>
  );
};
