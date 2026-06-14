import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { signUp, updateProfile } from '../../services/supabaseService';
import { useAuthStore } from '../../stores/authStore';
import './Register.css';

type SexOption = 'male' | 'female' | 'prefer_not_to_say' | '';

const Register = () => {
  const navigate = useNavigate();
  const signInUser = useAuthStore((state) => state.signInUser);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<SexOption>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (!confirmPw) {
      errs.confirmPw = 'Please confirm your password';
    } else if (password !== confirmPw) {
      errs.confirmPw = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (validate()) {
      setLoading(true);
      setErrors({});
      try {
                // Register account
        const signUpResult = await signUp(email, password, fullName) as any;
        const { user, token, requiresConfirmation } = signUpResult;

        if (requiresConfirmation) {
          alert('Account created successfully! A confirmation link has been sent to your email. Please verify your email before signing in.');
          navigate('/login');
          return;
        }

        signInUser(user, token);

        // Save optional demographics if entered
        if (age || sex) {
          const numericAge = age ? Number(age) : undefined;
          const profileUpdates = {
            age: numericAge,
            sex: sex || undefined,
          };
          const updatedUser = await updateProfile(email, profileUpdates);
          updateUserProfile(updatedUser);
        }

        navigate('/home');
      } catch (err: any) {
        console.error('Registration error:', err);
        setErrors({ form: err.message || 'Failed to create account. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.form; // clear general error when editing fields
      return next;
    });
  };

  return (
    <div className="register-screen">
      <div className="register-header">
        <button
          type="button"
          className="register-back-btn"
          onClick={() => navigate('/auth')}
          disabled={loading}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="register-body">
        <form className="register-form-wrap" onSubmit={handleSubmit} noValidate>
          <h1 className="register-heading">Create Account</h1>
          <p className="register-subtitle">Join MediTrack for personalized insights</p>

          {errors.form && <div className="register-form-error">{errors.form}</div>}

          {/* Full Name */}
          <div className="register-field">
            <label className="register-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              className={`register-input ${errors.fullName ? 'error' : ''}`}
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError('fullName');
              }}
              autoComplete="name"
              disabled={loading}
            />
            {errors.fullName && <span className="register-error-msg">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="register-field">
            <label className="register-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className={`register-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className="register-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="register-field">
            <label className="register-label" htmlFor="reg-pw">Password</label>
            <div className="register-input-wrap">
              <input
                id="reg-pw"
                type={showPw ? 'text' : 'password'}
                className={`register-input ${errors.password ? 'error' : ''}`}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
                autoComplete="new-password"
                style={{ paddingRight: 48 }}
                disabled={loading}
              />
              <button
                type="button"
                className="register-toggle-pw"
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
                disabled={loading}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="register-error-msg">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="register-field">
            <label className="register-label" htmlFor="reg-cpw">Confirm Password</label>
            <div className="register-input-wrap">
              <input
                id="reg-cpw"
                type={showConfirmPw ? 'text' : 'password'}
                className={`register-input ${errors.confirmPw ? 'error' : ''}`}
                placeholder="Re-enter password"
                value={confirmPw}
                onChange={(e) => {
                  setConfirmPw(e.target.value);
                  clearError('confirmPw');
                }}
                autoComplete="new-password"
                style={{ paddingRight: 48 }}
                disabled={loading}
              />
              <button
                type="button"
                className="register-toggle-pw"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                tabIndex={-1}
                disabled={loading}
              >
                {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPw && <span className="register-error-msg">{errors.confirmPw}</span>}
          </div>

          {/* Optional collapsible */}
          <div className="register-optional">
            <button
              type="button"
              className="register-optional-toggle"
              onClick={() => setOptionalOpen(!optionalOpen)}
              disabled={loading}
            >
              <div className="register-optional-toggle-text">
                <span>Improve accuracy (recommended)</span>
                <span>Age and sex help us give better insights</span>
              </div>
              <ChevronDown
                size={20}
                className={`register-optional-chevron ${optionalOpen ? 'open' : ''}`}
              />
            </button>

            {optionalOpen && (
              <div className="register-optional-content">
                <div className="register-field">
                  <label className="register-label" htmlFor="reg-age">Age</label>
                  <input
                    id="reg-age"
                    type="number"
                    className="register-age-input"
                    placeholder="e.g. 30"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="register-field">
                  <label className="register-label">Sex</label>
                  <div className="register-radio-group">
                    {([
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                    ] as const).map((opt) => (
                      <label
                        key={opt.value}
                        className={`register-radio ${sex === opt.value ? 'active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="sex"
                          value={opt.value}
                          checked={sex === opt.value}
                          onChange={() => setSex(opt.value)}
                          disabled={loading}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="register-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="register-bottom-text">
            Already have an account?{' '}
            <button
              type="button"
              className="register-bottom-link"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
