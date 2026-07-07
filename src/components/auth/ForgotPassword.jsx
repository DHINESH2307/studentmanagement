import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { KeyRound, Mail, ArrowLeft, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ForgotPassword({ onNavigate, onSuccess, onError, isSupabaseConfigured }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!isSupabaseConfigured) {
      onError('Supabase environment variables are not configured.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(email);
      setSubmitted(true);
      onSuccess('Password reset link sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      background: 'radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), var(--bg-app)',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px 36px',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-primary)',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
          }}>
            <KeyRound size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            We'll send a recovery link to your email address
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-warning-light)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--color-warning)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <span>Demo Mode: Add Supabase keys to enable password resets.</span>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-light)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-danger)',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {submitted ? (
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-success-light)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}>
            <CheckCircle size={36} color="var(--color-success)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Check Your Inbox</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px' }} disabled={loading}>
              <span>{loading ? 'Sending Link...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
