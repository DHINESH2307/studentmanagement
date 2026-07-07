import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { User, Mail, Shield, KeyRound, Save, Loader2, CheckCircle } from 'lucide-react';

export default function Profile({ user, onSuccess, onError }) {
  const [name, setName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onError('Display name cannot be empty.');
      return;
    }

    setSavingName(true);
    setNameSuccess(false);
    try {
      await authService.updateProfile({ name: name.trim() });
      setNameSuccess(true);
      onSuccess('Profile display name updated successfully!');
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      onError(err.message || 'Failed to update profile name.');
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      onError('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      onError('New passwords do not match.');
      return;
    }
    if (password.length < 6) {
      onError('Password must be at least 6 characters long.');
      return;
    }

    setSavingPassword(true);
    setPasswordSuccess(false);
    try {
      await authService.updatePassword(password);
      setPasswordSuccess(true);
      setPassword('');
      setConfirmPassword('');
      onSuccess('Password changed successfully!');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      onError(err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Manage your personal details, email credentials, and security settings.
        </p>
      </div>

      {/* Account Info Card */}
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
            <User size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Personal Information</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update your public profile appearance</p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address (Read-Only)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="input-field"
                value={user?.email || ''}
                disabled
                style={{ paddingLeft: '42px', background: 'var(--bg-hover)', cursor: 'not-allowed', opacity: 0.7 }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Your email is managed by your Supabase authentication identity.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Display Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', paddingTop: '8px' }}>
            <div>
              {nameSuccess && (
                <span style={{ color: 'var(--color-success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} />
                  <span>Name saved!</span>
                </span>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingName}>
              {savingName ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
              <span>{savingName ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Card */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-warning-light)',
            color: 'var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <KeyRound size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Security & Credentials</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Change your account password</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', paddingTop: '8px' }}>
            <div>
              {passwordSuccess && (
                <span style={{ color: 'var(--color-success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} />
                  <span>Password updated!</span>
                </span>
              )}
            </div>
            <button type="submit" className="btn btn-secondary" disabled={savingPassword}>
              {savingPassword ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Shield size={18} />}
              <span>{savingPassword ? 'Updating...' : 'Change Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
