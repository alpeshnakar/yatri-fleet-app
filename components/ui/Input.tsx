import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  const baseClasses = 'block w-full shadow-sm sm:text-sm bg-slate-700 border-slate-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50';
  const combinedClasses = `${baseClasses} ${className}`;

  return <input className={combinedClasses} {...props} />;
};

export default Input;