import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Mail, LogOut, Code } from 'lucide-react';
import type { NavbarProps } from '../types';
import { Button } from './ui';

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => (
  <nav className="bg-slate-800 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2 font-bold text-xl">
        <Code className="text-blue-400" />
        <span>DevCapstone</span>
      </div>
      <div className="space-x-4 flex items-center">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
            </Link>
            <Link to="/templates" className="hover:text-blue-400 flex items-center">
              <Mail className="w-4 h-4 mr-1" /> Templates
            </Link>
            <Button onClick={onLogout} variant="danger" className="px-3 py-1">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
