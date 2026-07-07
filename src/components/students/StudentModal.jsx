import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { X, Upload, Trash2, User, Mail, Phone, Building, GraduationCap, Loader2 } from 'lucide-react';

export default function StudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  departmentsList = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Arts & Humanities']
}) {
  const isEditing = Boolean(student && student.id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(departmentsList[0]);
  const [year, setYear] = useState('1');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setName(student.name || '');
        setEmail(student.email || '');
        setPhone(student.phone || '');
        setDepartment(student.department || departmentsList[0]);
        setYear(student.year ? String(student.year) : '1');
        setAvatarUrl(student.avatar_url || '');
        setImagePreview(student.avatar_url || null);
      } else {
        setName('');
        setEmail('');
        setPhone('');
        setDepartment(departmentsList[0]);
        setYear('1');
        setAvatarUrl('');
        setImagePreview(null);
      }
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen, student]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required.';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file (PNG, JPG, WEBP).' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB.' }));
      return;
    }

    setErrors(prev => ({ ...prev, image: undefined }));
    setImageFile(file);

    // Create live preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setAvatarUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // If user selected a new image file, upload to Supabase Storage first
      if (imageFile) {
        setUploading(true);
        try {
          const prefix = isEditing ? `student_${student.id}` : 'student_new';
          finalAvatarUrl = await storageService.uploadImage(imageFile, prefix);
        } catch (uploadErr) {
          setErrors(prev => ({ ...prev, image: uploadErr.message }));
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      } else if (!imagePreview && avatarUrl) {
        // User removed the existing image
        finalAvatarUrl = null;
      }

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        department,
        year: parseInt(year, 10),
        avatar_url: finalAvatarUrl || null,
      };

      await onSave(payload, isEditing ? student.id : null);
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: err.message || 'Failed to save student record.' }));
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '560px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>{isEditing ? 'Edit Student Profile' : 'Add New Student'}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isEditing ? 'Update student information and profile photo' : 'Enter details to register a student in the system'}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ color: 'var(--text-muted)' }} disabled={saving}>
            <X size={20} />
          </button>
        </div>

        {errors.submit && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-danger)',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Profile Photo Upload Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview} alt="Preview" className="avatar" style={{ width: '72px', height: '72px' }} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--color-danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                  title="Remove photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="avatar" style={{ width: '72px', height: '72px', fontSize: '1.5rem', background: 'var(--bg-input)' }}>
                <User size={32} color="var(--text-muted)" />
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>Profile Photo</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Upload PNG, JPG, or WEBP (max 5MB)
              </div>
              <label className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex' }}>
                <Upload size={16} />
                <span>{imagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  disabled={saving || uploading}
                />
              </label>
              {errors.image && <div className="error-text" style={{ marginTop: '6px' }}>{errors.image}</div>}
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                style={{ paddingLeft: '42px' }}
                disabled={saving}
              />
            </div>
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          {/* Email & Phone Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="jane@college.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }}
                  style={{ paddingLeft: '42px' }}
                  disabled={saving}
                />
              </div>
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  className={`input-field ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }}
                  style={{ paddingLeft: '42px' }}
                  disabled={saving}
                />
              </div>
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>
          </div>

          {/* Department & Year Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Department *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Building size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <select
                  className="select-field"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  disabled={saving}
                >
                  {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Academic Year *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <GraduationCap size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <select
                  className="select-field"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  disabled={saving}
                >
                  {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={String(y)}>Year {y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div style={{ display: 'flex', gap: '12px', justify: 'flex-end', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {(saving || uploading) && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              <span>{uploading ? 'Uploading Photo...' : saving ? 'Saving...' : isEditing ? 'Update Student' : 'Create Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
