import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
};
