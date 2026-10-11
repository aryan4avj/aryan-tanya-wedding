"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, duration = 2800) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 flex flex-col items-center gap-2 z-[8000]"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" }}
      >
        {toasts.map((t) => (
          <ToastMessage key={t.id} message={t.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastMessage({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      role="status"
      style={{
        background: "var(--charcoal)",
        color: "var(--ivory)",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        padding: "0.65rem 1.4rem",
        borderRadius: "9999px",
        pointerEvents: "none",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        boxShadow: "0 4px 20px rgba(66,58,54,0.3)",
      }}
    >
      {message}
    </div>
  );
}
