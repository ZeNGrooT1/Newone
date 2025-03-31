
import React, { useEffect } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast.tsx"

export function Toaster() {
  const { toasts, addToast, dismissToast } = useToast()

  // Listen for toast events globally - with debounce to avoid duplicate toasts
  useEffect(() => {
    const toastMessages = new Set();
    const debounceTime = 500; // milliseconds
    
    const handleToast = (event: CustomEvent<any>) => {
      const detail = event.detail;
      const messageKey = `${detail.variant}-${detail.description}`;
      
      // If this exact message was shown recently, ignore it
      if (toastMessages.has(messageKey)) {
        return;
      }
      
      // Add message to the set and remove it after debounce time
      toastMessages.add(messageKey);
      setTimeout(() => {
        toastMessages.delete(messageKey);
      }, debounceTime);
      
      // Add the toast
      addToast(detail);
    };
    
    // Add data attribute for toast helper detection
    const toastHelper = document.createElement('div');
    toastHelper.setAttribute('data-toast-helper', 'true');
    toastHelper.style.display = 'none';
    document.body.appendChild(toastHelper);
    
    // Add event listener
    document.addEventListener('toast', handleToast as EventListener);
    
    return () => {
      document.removeEventListener('toast', handleToast as EventListener);
      document.body.removeChild(toastHelper);
    };
  }, [addToast]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }, index) {
        return (
          <Toast key={id || index} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => id && dismissToast(id)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
