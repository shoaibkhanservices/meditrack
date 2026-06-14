import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Shield, Activity } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import './AuthGate.css';

const AuthGate = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  const setGuest = useAuthStore((state) => state.setGuest);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (token || isGuest) {
      navigate('/home', { replace: true });
    }
  }, [token, isGuest, navigate]);

  const handleContinueAsGuest = () => {
    setGuest(true);
    navigate('/home');
  };

  return (
    <div className="auth-gate">
      <div className="auth-hero">
        <div className="auth-float-icon">
          <Stethoscope size={40} />
        </div>
        <div className="auth-float-icon">
          <Heart size={36} />
        </div>
        <div className="auth-float-icon">
          <Shield size={32} />
        </div>
        <div className="auth-float-icon">
          <Activity size={34} />
        </div>

        <div className="auth-hero-content">
          <h1>Welcome to MediTrack</h1>
          <p>Get instant AI-powered health insights. Know what to do next.</p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-card-inner">
          <button
            type="button"
            className="auth-btn-primary"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>

          <button
            type="button"
            className="auth-btn-secondary"
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          <button
            type="button"
            className="auth-guest-link"
            onClick={handleContinueAsGuest}
          >
            Continue as Guest
          </button>

          <p className="auth-disclaimer">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
