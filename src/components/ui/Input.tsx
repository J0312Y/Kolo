import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full border-2 ${
              error ? 'border-red-500' : 'border-gray-200'
            } rounded-xl p-4 ${
              icon ? 'pl-12' : ''
            } ${
              suffix ? 'pr-16' : ''
            } text-gray-900 focus:border-blue-500 focus:outline-none ${className}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
