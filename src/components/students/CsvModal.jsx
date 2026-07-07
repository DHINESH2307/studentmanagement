import React, { useState } from 'react';
import Papa from 'papaparse';
import { studentService } from '../../services/studentService';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function CsvModal({ isOpen, onClose, mode = 'import', students = [], onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file (.csv).');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setImportResult(null);

    // Parse CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data || []);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      }
    });
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      setError('No data found in CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await studentService.importStudentsCsv(parsedData);
      setImportResult(res);
      if (res.inserted > 0 && onImportSuccess) {
        onImportSuccess(`Successfully imported ${res.inserted} student records.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to import records.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!students || students.length === 0) {
      setError('No student records available to export.');
      return;
    }

    // Format students for clean CSV export
    const exportData = students.map(s => ({
      ID: s.id,
      Name: s.name,
      Email: s.email,
      Phone: s.phone,
      Department: s.department,
      Year: s.year,
      Created_At: s.created_at,
      Avatar_URL: s.avatar_url || ''
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '540px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: mode === 'import' ? 'var(--color-primary-light)' : 'var(--color-success-light)',
              color: mode === 'import' ? 'var(--color-primary)' : 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>{mode === 'import' ? 'Import Students from CSV' : 'Export Students to CSV'}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {mode === 'import' ? 'Batch upload student records via CSV spreadsheet' : 'Download current directory data as a spreadsheet'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ color: 'var(--text-muted)' }} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-danger)',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {mode === 'import' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!importResult ? (
              <>
                <div style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'var(--bg-hover)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <Upload size={36} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                      {file ? file.name : 'Select CSV spreadsheet to upload'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Required headers: name, email, phone, department, year
                    </div>
                  </div>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', marginTop: '6px' }}>
                    <span>Browse CSV File</span>
                    <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>

                {parsedData.length > 0 && (
                  <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justify: 'space-between' }}>
                    <span>Ready to import: <strong>{parsedData.length} records</strong> found in CSV.</span>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>Import Process Completed</div>
                    <div style={{ fontSize: '0.875rem' }}>Successfully inserted {importResult.inserted} records into Supabase database.</div>
                  </div>
                </div>

                {importResult.errors && importResult.errors.length > 0 && (
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-warning-light)', border: '1px solid rgba(245,158,11,0.3)', maxHeight: '180px', overflowY: 'auto' }}>
                    <div style={{ fontWeight: '600', color: 'var(--color-warning)', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={16} />
                      <span>Skipped / Validation Warnings ({importResult.errors.length}):</span>
                    </div>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {importResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justify: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                {importResult ? 'Close' : 'Cancel'}
              </button>
              {!importResult && (
                <button className="btn btn-primary" onClick={handleImport} disabled={!file || parsedData.length === 0 || loading}>
                  {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                  <span>{loading ? 'Importing...' : 'Start Import'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              You are about to export <strong>{students.length} student records</strong> to a CSV spreadsheet file. This includes all names, contact details, departments, and timestamps.
            </p>

            <div style={{ display: 'flex', gap: '12px', justify: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleExport} style={{ background: 'var(--gradient-accent)' }}>
                <Download size={18} />
                <span>Download CSV File</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
