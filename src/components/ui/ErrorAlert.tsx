import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'error' | 'warning';
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  onRetry, 
  className = '',
  variant = 'error'
}) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const iconClasses = {
    error: 'text-red-500',
    warning: 'text-yellow-500'
  };

  return (
    <div className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${iconClasses[variant]}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {variant === 'error' ? 'Error' : 'Warning'}
          </p>
          <p className="text-sm mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center text-sm font-medium hover:underline"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;