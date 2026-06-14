import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signIn } from '../../services/supabaseService';
import { useAuthStore } from '../../stores/authStore';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const signInUser = useAuthStore((state) => state.signInUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (validate()) {
      setLoading(true);
      setErrors({});
      try {
        const { user, token } = await signIn(email, password);
        signInUser(user, token);
        navigate('/home');
      } catch (err: any) {
        console.error('Sign-in error:', err);
        setErrors({ form: err.message || 'Authentication failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-screen">
      <div className="login-header">
        <button className="login-back-btn" onClick={() => navigate('/auth')}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="login-body">
        <form className="login-form-wrap" onSubmit={handleSubmit} noValidate>
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>

          {errors.form && <div className="login-form-error">{errors.form}</div>}

          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email</label>
            <div className="login-input-wrap">
              <input
                id="login-email"
                type="email"
                className={`login-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
                }}
                autoComplete="email"
                disabled={loading}
              />
            </div>
            {errors.email && <span className="login-error-msg">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className={`login-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                }}
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
                disabled={loading}
              />
              <button
                type="button"
                className="login-toggle-pw"
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
                disabled={loading}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="login-error-msg">{errors.password}</span>}
          </div>

          <button
            type="button"
            className="login-forgot"
            onClick={() => alert('Demo Feature: Mock password reset link sent.')}
            disabled={loading}
          >
            Forgot password?
          </button>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login-bottom-text">
            Don't have an account?{' '}
            <button
              type="button"
              className="login-bottom-link"
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
