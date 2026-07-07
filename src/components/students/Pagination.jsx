import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="glass-card" style={{
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      {/* Items counter and page size selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <div>
          Showing <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{startItem}</span> to{' '}
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{endItem}</span> of{' '}
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{totalCount}</span> entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="page-size-select" style={{ color: 'var(--text-muted)' }}>Rows per page:</label>
          <select
            id="page-size-select"
            className="select-field"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ padding: '4px 10px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Page navigation buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{ padding: '6px 12px' }}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span className="desktop-only-text">Prev</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
            {currentPage}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ {totalPages}</span>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{ padding: '6px 12px' }}
          aria-label="Next Page"
        >
          <span className="desktop-only-text">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
