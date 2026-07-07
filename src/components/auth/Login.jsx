import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { LogIn, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function Login({ onNavigate, onSuccess, onError, isSupabaseConfigured }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!isSupabaseConfigured) {
      onError('Supabase environment variables are not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      onSuccess('Successfully logged in!');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
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
            <LogIn size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Sign in to access your Student Management System
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
            <span>Demo Mode: Add Supabase keys to your .env file to enable authentication.</span>
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

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="form-label">
              <span>Password</span>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => onNavigate('forgot-password')}
                style={{ padding: 0, fontSize: '0.8rem', color: 'var(--color-primary)' }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '6px' }} disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            style={{ color: 'var(--color-primary)', fontWeight: '600' }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
