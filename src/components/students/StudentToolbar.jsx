import React from 'react';
import { Search, Filter, Plus, Upload, Download, Trash2, X } from 'lucide-react';

export default function StudentToolbar({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  year,
  onYearChange,
  onOpenAddModal,
  onOpenCsvModal,
  selectedCount,
  onBulkDelete,
  departmentsList = ['All', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Arts & Humanities'],
  yearsList = ['All', '1', '2', '3', '4', '5', '6']
}) {
  return (
    <div className="glass-card" style={{
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="global-search-input"
            type="text"
            className="input-field"
            placeholder="Search by name, email, or department... (Ctrl+K)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: '42px', paddingRight: search ? '36px' : '14px', width: '100%' }}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '2px' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Actions Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {selectedCount > 0 && (
            <button className="btn btn-danger" onClick={onBulkDelete} style={{ animation: 'fadeIn var(--transition-fast)' }}>
              <Trash2 size={18} />
              <span>Delete ({selectedCount})</span>
            </button>
          )}

          <button className="btn btn-secondary" onClick={() => onOpenCsvModal('import')} title="Import from CSV">
            <Upload size={18} />
            <span className="desktop-only-text">Import</span>
          </button>

          <button className="btn btn-secondary" onClick={() => onOpenCsvModal('export')} title="Export to CSV">
            <Download size={18} />
            <span className="desktop-only-text">Export</span>
          </button>

          <button className="btn btn-primary" onClick={onOpenAddModal} title="Add New Student (Alt+N)">
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        {/* Department Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="dept-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Department:</label>
          <select
            id="dept-filter"
            className="select-field"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', minWidth: '160px' }}
          >
            {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Year Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="year-filter" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Academic Year:</label>
          <select
            id="year-filter"
            className="select-field"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', minWidth: '100px' }}
          >
            {yearsList.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : `Year ${y}`}</option>)}
          </select>
        </div>

        {(department !== 'All' || year !== 'All' || search) && (
          <button
            onClick={() => {
              onSearchChange('');
              onDepartmentChange('All');
              onYearChange('All');
            }}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <X size={14} />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
