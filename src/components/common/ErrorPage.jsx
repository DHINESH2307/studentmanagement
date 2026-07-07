import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({ title, message, onRetry, onHome }) {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="glass-panel" style={{
        padding: '48px 36px',
        textAlign: 'center',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <AlertOctagon size={44} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>{title || 'Oops! Something went wrong'}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
          {message || 'An unexpected error occurred while processing your request. Please try reloading or check your database connection.'}
        </p>

        <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center' }}>
          {onRetry && (
            <button className="btn btn-primary" onClick={onRetry}>
              <RefreshCw size={18} />
              <span>Try Again</span>
            </button>
          )}
          {onHome && (
            <button className="btn btn-secondary" onClick={onHome}>
              <Home size={18} />
              <span>Go to Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
