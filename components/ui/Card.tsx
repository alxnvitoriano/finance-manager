import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg ${className}`}>
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-100">{title}</h3>}
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
