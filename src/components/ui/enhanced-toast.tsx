import { ReactNode } from 'react';
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport, ToastActionElement } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EnhancedToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  action?: ToastActionElement;
  duration?: number;
}

export const EnhancedToaster = () => {
  const { toasts } = useToast();

  const getToastIcon = (variant: string) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getToastStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      default:
        return '';
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = (props as any).variant || 'default';
        const icon = getToastIcon(variant);
        const styles = getToastStyles(variant);

        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              'transform transition-all duration-300 ease-out',
              'animate-slide-in-right hover:scale-105',
              styles
            )}
          >
            <div className="flex items-start gap-3">
              {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
              <div className="flex-1 min-w-0">
                {title && (
                  <ToastTitle className="text-sm font-semibold">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm opacity-90">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-auto sm:right-0 sm:top-4 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  );
};

// Helper function to show enhanced toasts
export const showEnhancedToast = (props: EnhancedToastProps) => {
  const { toast } = useToast();
  
  return toast({
    title: props.title,
    description: props.description,
    duration: props.duration || 5000,
    action: props.action,
    variant: props.variant as any
  });
};
