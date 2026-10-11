import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AppIcon } from '../../components/ui/Icon';

const AdminLogin = () => {
  const { navigate } = useRouter();
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error);
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#18181b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 1.5rem)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: 'clamp(1.5rem, 6vw, 2.5rem)',
          boxShadow: 'var(--shadow-raised)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/brand/unique-logo.svg"
            alt="Unique Furniture"
            style={{
              height: '38px',
              margin: '0 auto 1.25rem',
              display: 'block'
            }}
          />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-secondary)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-raised-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem',
              letterSpacing: '0.04em'
            }}
          >
            <AppIcon name="check" size={13} color="var(--brand-orange)" />
            <span>STAFF & SHOWROOM CMS</span>
          </div>
          <h1
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#18181b',
              margin: 0
            }}
          >
            Management Sign In
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem'
            }}
          >
            Unique Furniture · Sulaymaniyah Showroom
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#27272a',
                marginBottom: '0.4rem'
              }}
            >
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '13px', left: '12px', display: 'flex', alignItems: 'center' }}>
                <AppIcon name="user" size={17} color="var(--brand-orange)" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="neu-input"
                style={{
                  height: '44px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  fontSize: '0.92rem'
                }}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#27272a',
                marginBottom: '0.4rem'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '13px', left: '12px', display: 'flex', alignItems: 'center' }}>
                <AppIcon name="lock" size={17} color="var(--brand-orange)" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="neu-input"
                style={{
                  height: '44px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  fontSize: '0.92rem'
                }}
                placeholder="unique2025"
              />
            </div>
          </div>

          {/* Clean Credentials Hint */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-pressed-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}
          >
            Showroom credentials: <strong>admin</strong> / <strong>unique2025</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-brand"
            style={{
              width: '100%',
              minHeight: '46px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '0.94rem',
              marginTop: '0.5rem'
            }}
          >
            <AppIcon name="lock" size={16} />
            <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid #f4f4f5', paddingTop: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Return to Public Showroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
