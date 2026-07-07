import React from 'react';
import { Users, UserPlus, Building2, TrendingUp, Search, Upload, Download, Plus, ArrowRight, Clock } from 'lucide-react';

export default function Dashboard({ 
  stats, 
  loading, 
  onNavigate, 
  onOpenAddModal, 
  onOpenCsvModal, 
  onOpenSearch 
}) {
  const departmentColors = [
    '#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'
  ];

  const totalStudents = stats?.total || 0;
  const recentStudents = stats?.recent || [];
  const deptCounts = stats?.departmentCounts || {};
  const deptsList = Object.entries(deptCounts);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner / Welcome Header */}
      <div className="glass-card" style={{
        padding: '32px',
        background: 'radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Student Directory Overview</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Manage student profiles, track department enrollment, and execute bulk operations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => onOpenCsvModal('import')}>
              <Upload size={18} />
              <span>Import CSV</span>
            </button>
            <button className="btn btn-secondary" onClick={() => onOpenCsvModal('export')}>
              <Download size={18} />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-primary" onClick={onOpenAddModal}>
              <Plus size={18} />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {/* Card 1: Total Students */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Students
            </span>
            {loading ? (
              <div className="skeleton" style={{ width: '80px', height: '36px', marginTop: '8px' }} />
            ) : (
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>
                {totalStudents}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '8px', fontWeight: '500' }}>
              <TrendingUp size={14} />
              <span>Active directory</span>
            </div>
          </div>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Users size={28} />
          </div>
        </div>

        {/* Card 2: Recently Added */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recently Added
            </span>
            {loading ? (
              <div className="skeleton" style={{ width: '60px', height: '36px', marginTop: '8px' }} />
            ) : (
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>
                {recentStudents.length}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <Clock size={14} />
              <span>In last 30 days</span>
            </div>
          </div>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-success-light)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <UserPlus size={28} />
          </div>
        </div>

        {/* Card 3: Departments */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Departments
            </span>
            {loading ? (
              <div className="skeleton" style={{ width: '60px', height: '36px', marginTop: '8px' }} />
            ) : (
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>
                {deptsList.length || 0}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Academic branches</span>
            </div>
          </div>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-warning-light)',
            color: 'var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Building2 size={28} />
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Added & Department Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
      }}>
        {/* Recently Added Students List */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--color-primary)" />
              <span>Recently Added Students</span>
            </h3>
            <button 
              className="btn-ghost" 
              onClick={() => onNavigate('students')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-primary)' }}
            >
              <span>View all</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3, 4].map(n => <div key={n} className="skeleton" style={{ height: '56px', width: '100%' }} />)}
            </div>
          ) : recentStudents.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No students recorded yet. Click "Add Student" to begin.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentStudents.map((student) => (
                <div key={student.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {student.avatar_url ? (
                      <img src={student.avatar_url} alt={student.name} className="avatar" />
                    ) : (
                      <div className="avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {student.email}
                      </div>
                    </div>
                  </div>
                  <div className="badge badge-primary">
                    {student.department}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Breakdown Chart / List */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={20} color="var(--color-secondary)" />
            <span>Department Enrollment Breakdown</span>
          </h3>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: '44px', width: '100%' }} />)}
            </div>
          ) : deptsList.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No department data available.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deptsList.map(([dept, count], index) => {
                const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                const barColor = departmentColors[index % departmentColors.length];

                return (
                  <div key={dept} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justify: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{dept}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                        {count} {count === 1 ? 'student' : 'students'} ({percentage}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-hover)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: barColor,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width var(--transition-slow)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
