import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-slate-800 text-white hover:bg-slate-700',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
