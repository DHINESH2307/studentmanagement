import React from 'react';
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, CheckSquare, Square, Mail, Phone, Calendar } from 'lucide-react';

export default function StudentTable({
  students,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSortChange
}) {
  const isAllSelected = students.length > 0 && selectedIds.length === students.length;

  const renderSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    return sortOrder === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}><Square size={18} style={{ opacity: 0.3 }} /></th>
              <th>Student</th>
              <th>Contact Info</th>
              <th>Department</th>
              <th>Year</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <tr key={n}>
                <td><div className="skeleton" style={{ width: '18px', height: '18px' }} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                      <div className="skeleton" style={{ width: '140px', height: '16px', marginBottom: '6px' }} />
                      <div className="skeleton" style={{ width: '90px', height: '12px' }} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="skeleton" style={{ width: '160px', height: '14px', marginBottom: '6px' }} />
                  <div className="skeleton" style={{ width: '110px', height: '12px' }} />
                </td>
                <td><div className="skeleton" style={{ width: '120px', height: '24px', borderRadius: '12px' }} /></td>
                <td><div className="skeleton" style={{ width: '50px', height: '16px' }} /></td>
                <td><div className="skeleton" style={{ width: '90px', height: '16px' }} /></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '48px' }}>
              <button
                onClick={onToggleSelectAll}
                style={{ color: isAllSelected ? 'var(--color-primary)' : 'var(--text-muted)', display: 'flex' }}
                aria-label="Select all students"
              >
                {isAllSelected ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
            </th>
            <th onClick={() => onSortChange('name')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Student</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th>Contact Info</th>
            <th>Department</th>
            <th>Year</th>
            <th onClick={() => onSortChange('created_at')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Created Date</span>
                {renderSortIcon('created_at')}
              </div>
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const isSelected = selectedIds.includes(student.id);

            return (
              <tr key={student.id} className="table-row" style={{ background: isSelected ? 'var(--color-primary-light)' : undefined }}>
                <td>
                  <button
                    onClick={() => onToggleSelect(student.id)}
                    style={{ color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)', display: 'flex' }}
                    aria-label={`Select ${student.name}`}
                  >
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID: {student.id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      <span>{student.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Phone size={14} />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-primary">
                    {student.department}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Year {student.year}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <span>{formatDate(student.created_at)}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => onEdit(student)}
                      className="btn-icon"
                      style={{ color: 'var(--color-primary)', background: 'var(--bg-hover)' }}
                      title="Edit Student"
                      aria-label={`Edit ${student.name}`}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="btn-icon"
                      style={{ color: 'var(--color-danger)', background: 'var(--bg-hover)' }}
                      title="Delete Student"
                      aria-label={`Delete ${student.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
