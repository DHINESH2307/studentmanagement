import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ user, authLoading, children, onNavigate }) {
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: 'var(--bg-app)',
      }}>
        <div style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }}>
          <Loader2 size={36} />
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>
          Authenticating session...
        </span>
      </div>
    );
  }

  if (!user) {
    return null; // Will trigger redirect in App.jsx
  }

  return children;
}
