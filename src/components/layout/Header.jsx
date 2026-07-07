import React from 'react';
import { Search, Sun, Moon, Bell, LogOut, User, Settings, ShieldAlert, Menu } from 'lucide-react';

export default function Header({ 
  user, 
  theme, 
  onToggleTheme, 
  onSignOut, 
  currentView, 
  onNavigate,
  onOpenSearch,
  onToggleSidebar,
  isSupabaseConfigured 
}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'students': return 'Student Directory';
      case 'profile': return 'User Profile';
      case 'settings': return 'System Settings';
      default: return 'Portal';
    }
  };

  const getBreadcrumb = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>Home</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{getPageTitle()}</span>
      </div>
    );
  };

  return (
    <header style={{
      height: '72px',
      background: 'var(--bg-header)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="btn-icon mobile-only-btn" 
          onClick={onToggleSidebar}
          style={{ display: 'none', color: 'var(--text-primary)' }}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{getPageTitle()}</h2>
          {getBreadcrumb()}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isSupabaseConfigured && (
          <div className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
            <ShieldAlert size={16} />
            <span>Demo Mode (Add .env keys)</span>
          </div>
        )}

        {/* Global Search Shortcut Hint */}
        {currentView !== 'students' && (
          <button 
            onClick={() => {
              onNavigate('students');
              setTimeout(onOpenSearch, 100);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 14px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
            title="Search students (Ctrl+K)"
          >
            <Search size={16} />
            <span>Search directory...</span>
            <kbd style={{ 
              background: 'var(--bg-hover)', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontSize: '0.75rem', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)'
            }}>Ctrl K</kbd>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button 
          className="btn-icon" 
          onClick={onToggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{ 
            background: 'var(--bg-hover)', 
            color: 'var(--text-primary)',
            padding: '10px',
            borderRadius: 'var(--radius-full)',
          }}
          aria-label="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Profile Dropdown */}
        <div className="user-dropdown-container" style={{ position: 'relative' }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: 'var(--bg-hover)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '8px',
              width: '220px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 100,
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.user_metadata?.name || 'Admin User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'admin@portal.edu'}
                </div>
              </div>

              <button 
                className="btn-ghost" 
                onClick={() => { onNavigate('profile'); setDropdownOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button 
                className="btn-ghost" 
                onClick={() => { onNavigate('settings'); setDropdownOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

              <button 
                className="btn-ghost" 
                onClick={() => { onSignOut(); setDropdownOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
