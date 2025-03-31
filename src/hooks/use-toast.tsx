
import * as React from "react";
import { createContext, useContext, useState } from "react";

// Types for toast
export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
};

type ToastContextType = {
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast function with variants
export const toast = {
  default: (message: string) => {
    if (typeof window !== "undefined") {
      console.log("DEFAULT:", message);
      // Get all ToastContext instances in the document
      const toastHelpers = document.querySelectorAll('[data-toast-helper="true"]');
      if (toastHelpers.length > 0) {
        // Handle toast through global event
        const event = new CustomEvent('toast', { 
          detail: { description: message, variant: "default" } 
        });
        document.dispatchEvent(event);
      } else {
        console.warn("Toast provider not found");
      }
    }
  },
  success: (message: string) => {
    if (typeof window !== "undefined") {
      console.log("SUCCESS:", message);
      const event = new CustomEvent('toast', { 
        detail: { description: message, variant: "success" } 
      });
      document.dispatchEvent(event);
    }
  },
  error: (message: string) => {
    if (typeof window !== "undefined") {
      console.log("ERROR:", message);
      const event = new CustomEvent('toast', { 
        detail: { description: message, variant: "destructive" } 
      });
      document.dispatchEvent(event);
    }
  },
  info: (message: string) => {
    if (typeof window !== "undefined") {
      console.log("INFO:", message);
      const event = new CustomEvent('toast', { 
        detail: { description: message, variant: "info" } 
      });
      document.dispatchEvent(event);
    }
  },
  warning: (message: string) => {
    if (typeof window !== "undefined") {
      console.log("WARNING:", message);
      const event = new CustomEvent('toast', { 
        detail: { description: message, variant: "warning" } 
      });
      document.dispatchEvent(event);
    }
  },
};
