'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/auth';
import Link from 'next/link';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Check for remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setCredentials(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login for:', credentials.email);
      const response = await authService.login(credentials);
      console.log('Login response received');
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', credentials.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      login(response.data, response.data.token);
      
      // Small delay for better UX
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
    } catch (err) {
      console.error('Login error:', err);
      
      // User-friendly error messages
      const errorMessage = err.response?.data?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (errorMessage.includes('network') || !err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    const demoCredentials = {
      email: role === 'trainer' ? 'demo_trainer@fitplanhub.com' : 'demo_user@fitplanhub.com',
      password: 'demopassword123'
    };
    
    try {
      const response = await authService.login(demoCredentials);
      login(response.data, response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Demo login currently unavailable. Please use your own account.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Decorative background elements */}
        <div style={styles.decorativeElements}>
          <div style={styles.decorativeCircle1}></div>
          <div style={styles.decorativeCircle2}></div>
        </div>
        
        {/* Logo/Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>💪</span>
            <h1 style={styles.logoText}>FitPlanHub</h1>
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to continue your fitness journey</p>
        </div>

        {/* Demo login buttons */}
        <div style={styles.demoSection}>
          <p style={styles.demoText}>Try demo accounts:</p>
          <div style={styles.demoButtons}>
            <button 
              type="button" 
              onClick={() => handleDemoLogin('user')}
              style={styles.demoUserButton}
              disabled={loading}
            >
              Demo User
            </button>
            <button 
              type="button" 
              onClick={() => handleDemoLogin('trainer')}
              style={styles.demoTrainerButton}
              disabled={loading}
            >
              Demo Trainer
            </button>
          </div>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Error display */}
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorMessage}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                style={styles.input}
                required
                disabled={loading}
                autoComplete="email"
              />
              <span style={styles.inputIcon}>✉️</span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                style={styles.input}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <span style={styles.inputIcon}>🔒</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.showPasswordButton}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div style={styles.passwordHelper}>
              <Link href="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
          </div>

          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
                disabled={loading}
              />
              <span style={styles.checkboxText}>Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            style={loading ? styles.buttonLoading : styles.button}
            disabled={loading}
          >
            {loading ? (
              <div style={styles.loadingContent}>
                <div style={styles.spinner}></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            New to FitPlanHub?{' '}
            <Link href="/register" style={styles.link}>
              Create an account
            </Link>
          </p>
          <div style={styles.securityNote}>
            <span style={styles.securityIcon}>🛡️</span>
            <span style={styles.securityText}>Your data is securely encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles with fitness theme
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  
  decorativeCircle1: {
    position: 'absolute',
    top: '-100px',
    right: '-100px',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ea5e920, #0284c710)',
  },
  
  decorativeCircle2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-150px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b98110, #05966920)',
  },
  
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  
  logoIcon: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '800',
    margin: 0,
    background: 'linear-gradient(135deg, #1e293b, #475569)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.025em',
  },
  
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.025em',
  },
  
  subtitle: {
    color: '#64748b',
    fontSize: '0.9375rem',
    margin: 0,
    lineHeight: 1.5,
  },
  
  demoSection: {
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f1f5f9',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  
  demoText: {
    fontSize: '0.875rem',
    color: '#475569',
    margin: '0 0 0.75rem 0',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  demoButtons: {
    display: 'flex',
    gap: '0.75rem',
  },
  
  demoUserButton: {
    flex: 1,
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
    },
    
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  
  demoTrainerButton: {
    flex: 1,
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
    '::before': {
      content: '""',
      flex: 1,
      height: '1px',
      background: '#e2e8f0',
    },
    '::after': {
      content: '""',
      flex: 1,
      height: '1px',
      background: '#e2e8f0',
    },
  },
  
  dividerText: {
    padding: '0 1rem',
    color: '#94a3b8',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem',
    background: '#fef2f2',
    color: '#dc2626',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    border: '1px solid #fecaca',
    fontSize: '0.875rem',
  },
  
  errorIcon: {
    fontSize: '1rem',
  },
  
  errorMessage: {
    flex: 1,
  },
  
  form: {
    marginBottom: '2rem',
  },
  
  inputGroup: {
    marginBottom: '1.5rem',
  },
  
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '0.5rem',
  },
  
  inputWrapper: {
    position: 'relative',
  },
  
  input: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    fontSize: '0.9375rem',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    background: '#f8fafc',
    color: '#1e293b',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    
    ':focus': {
      outline: 'none',
      borderColor: '#0ea5e9',
      boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
      background: 'white',
    },
    
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    
    '::placeholder': {
      color: '#94a3b8',
    }
  },
  
  inputIcon: {
    position: 'absolute',
    left: '0.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    opacity: 0.6,
  },
  
  showPasswordButton: {
    position: 'absolute',
    right: '0.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    color: '#64748b',
    
    ':hover': {
      background: '#f1f5f9',
    },
    
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  
  passwordHelper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  
  forgotLink: {
    fontSize: '0.8125rem',
    color: '#0ea5e9',
    textDecoration: 'none',
    fontWeight: '500',
    
    ':hover': {
      textDecoration: 'underline',
    }
  },
  
  options: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  
  checkbox: {
    marginRight: '0.5rem',
    width: '1.125rem',
    height: '1.125rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  
  checkboxText: {
    fontSize: '0.875rem',
    color: '#475569',
  },
  
  button: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)',
    },
    
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  },
  
  buttonLoading: {
    ...this.button,
    opacity: 0.8,
    cursor: 'not-allowed',
  },
  
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  spinner: {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  footer: {
    textAlign: 'center',
  },
  
  footerText: {
    color: '#64748b',
    fontSize: '0.9375rem',
    margin: '0 0 1rem 0',
  },
  
  link: {
    color: '#0ea5e9',
    fontWeight: '600',
    textDecoration: 'none',
    
    ':hover': {
      textDecoration: 'underline',
    }
  },
  
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  
  securityIcon: {
    fontSize: '0.875rem',
  },
  
  securityText: {
    fontSize: '0.75rem',
    fontWeight: '500',
  },
};