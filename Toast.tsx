import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-cobalt flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-coral flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-ink-primary shadow-elevated',
    info: 'bg-white border-cobalt/30 text-ink-primary shadow-elevated',
    warning: 'bg-white border-amber-200 text-ink-primary shadow-elevated',
    error: 'bg-white border-coral/30 text-ink-primary shadow-elevated',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgStyles[toast.type]} backdrop-blur-sm`}>
        {icons[toast.type]}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};

