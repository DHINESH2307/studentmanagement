import React from 'react';
import { LayoutDashboard, Users, User, Settings, LogOut, GraduationCap, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Sidebar({ currentView, onNavigate, onSignOut, isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(4px)' }} 
        />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'open' : ''}`} style={{
        width: isCollapsed ? '80px' : '260px',
        height: '100vh',
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        left: 0,
        transition: 'width var(--transition-normal)',
        zIndex: 95,
      }}>
        <div>
          {/* Logo Brand Header */}
          <div style={{
            height: '72px',
            padding: isCollapsed ? '0 20px' : '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}>
                <GraduationCap size={22} />
              </div>
              {!isCollapsed && (
                <span style={{ fontSize: '1.2rem', fontWeight: '800', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
                  EduPortal
                </span>
              )}
            </div>

            {/* Mobile Close Button */}
            {isOpenMobile && (
              <button onClick={onCloseMobile} className="btn-icon" style={{ color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--color-primary-light)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    width: '100%',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  }}
                >
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout & Collapse */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onSignOut}
            title={isCollapsed ? 'Sign Out' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '14px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-danger)',
              fontWeight: '500',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          <button
            onClick={onToggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-hover)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              width: '100%',
              marginTop: '4px',
            }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
