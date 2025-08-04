import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string | number; label: string }[];
}

const Select: React.FC<SelectProps> = ({ className = '', options, ...props }) => {
  const baseClasses = 'block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md text-white';
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <select className={combinedClasses} {...props}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;