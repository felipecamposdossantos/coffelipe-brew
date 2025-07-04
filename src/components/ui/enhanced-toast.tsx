
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle, Info, Coffee } from 'lucide-react';
import { ReactNode } from 'react';

interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

class EnhancedToast {
  static success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-green-50 border-green-200 text-green-800',
    });
  }

  static error(message: string, options?: ToastOptions) {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-red-50 border-red-200 text-red-800',
    });
  }

  static warning(message: string, options?: ToastOptions) {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    });
  }

  static info(message: string, options?: ToastOptions) {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Info className="w-5 h-5 text-blue-600" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
    });
  }

  static coffee(message: string, options?: ToastOptions) {
    return toast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Coffee className="w-5 h-5 text-coffee-600" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-coffee-50 border-coffee-200 text-coffee-800',
    });
  }

  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: { duration?: number }
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      duration: options?.duration,
    });
  }
}

export { EnhancedToast };
