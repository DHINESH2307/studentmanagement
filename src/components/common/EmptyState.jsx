import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';

export default function EmptyState({ title, description, actionLabel, onAction, icon: IconComponent = FolderOpen }) {
  return (
    <div style={{
      padding: '64px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-color)',
      margin: '24px 0',
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <IconComponent size={36} />
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{title || 'No records found'}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '24px', fontSize: '0.95rem' }}>
        {description || 'There are no items to display at this time. Try adjusting your search or add a new record.'}
      </p>

      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          <Plus size={18} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
