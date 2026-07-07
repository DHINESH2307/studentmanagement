import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ isSupabaseConfigured }) {
  return (
    <footer style={{
      padding: '20px 32px',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-header)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>© {new Date().getFullYear()} EduPortal Management System. Built with clean architecture.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: isSupabaseConfigured ? 'var(--color-success)' : 'var(--color-warning)' 
          }} />
          <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Demo Mode (Local)'}</span>
        </div>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          RLS Secured <ShieldCheck size={14} color="var(--color-success)" />
        </span>
      </div>
    </footer>
  );
}
