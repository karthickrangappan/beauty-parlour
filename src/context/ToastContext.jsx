import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToaster = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = (message, type = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                t.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : t.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-white/10 border-white/10 text-white"
              }`}
            >
              {t.type === "success" && <CheckCircle size={20} />}
              {t.type === "error" && <AlertCircle size={20} />}
              {t.type === "info" && <Info size={20} />}
              <span className="text-sm font-bold uppercase tracking-wider">{t.message}</span>
              <button onClick={() => removeToast(t.id)} className="ml-2 hover:opacity-70">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
