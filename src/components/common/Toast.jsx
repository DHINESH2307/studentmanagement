import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success': return <CheckCircle size={20} color="var(--color-success)" />;
            case 'error': return <AlertCircle size={20} color="var(--color-danger)" />;
            default: return <Info size={20} color="var(--color-primary)" />;
          }
        };

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div style={{ flexShrink: 0 }}>{getIcon()}</div>
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</div>
            <button 
              onClick={() => onDismiss(toast.id)} 
              style={{ color: 'var(--text-muted)', padding: '4px' }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
