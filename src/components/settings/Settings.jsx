import React from 'react';
import { Sun, Moon, Laptop, Keyboard, Sliders, CheckCircle, HelpCircle } from 'lucide-react';

export default function Settings({ theme, onToggleTheme, pageSize, onPageSizeChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>System Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Customize application interface, default behaviors, and review keyboard shortcuts.
        </p>
      </div>

      {/* Theme Preference Card */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Appearance & Theme</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select your preferred visual mode</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button
            type="button"
            onClick={() => { if (theme !== 'light') onToggleTheme(); }}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: theme === 'light' ? 'var(--color-primary-light)' : 'var(--bg-hover)',
              border: `2px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--border-color)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Sun size={28} color={theme === 'light' ? 'var(--color-primary)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: '600', color: theme === 'light' ? 'var(--color-primary)' : 'var(--text-primary)' }}>Light Mode</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Clean, bright workspace interface</span>
          </button>

          <button
            type="button"
            onClick={() => { if (theme !== 'dark') onToggleTheme(); }}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: theme === 'dark' ? 'var(--color-primary-light)' : 'var(--bg-hover)',
              border: `2px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--border-color)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Moon size={28} color={theme === 'dark' ? 'var(--color-primary)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: '600', color: theme === 'dark' ? 'var(--color-primary)' : 'var(--text-primary)' }}>Dark Mode</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Sleek, eye-friendly dark colors</span>
          </button>
        </div>
      </div>

      {/* Table Defaults Card */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-secondary-light)',
            color: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sliders size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Directory Defaults</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure table pagination and display rules</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Default Rows Per Page</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Set the number of student records displayed on a single table page.
            </div>
          </div>

          <select
            className="select-field"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ width: '120px', padding: '8px 14px' }}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>
      </div>

      {/* Keyboard Shortcuts Card */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-success-light)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Keyboard size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Keyboard Shortcuts</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Work faster with keyboard bindings</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Focus global search bar</span>
            <kbd style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'monospace' }}>Ctrl + K</kbd>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Open Add Student modal</span>
            <kbd style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'monospace' }}>Alt + N</kbd>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Close active modal dialog</span>
            <kbd style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'monospace' }}>Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
