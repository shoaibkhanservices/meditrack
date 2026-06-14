import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token || isGuest) {
        navigate('/home', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, token, isGuest]);

  return (
    <div className="splash-screen">
      <div className="splash-particle" />
      <div className="splash-particle" />
      <div className="splash-particle" />

      <div className="splash-logo">
        <span className="splash-logo-medi">Medi</span>
        <span className="splash-logo-track">Track</span>
      </div>

      <p className="splash-tagline">Your Health. Your Insight.</p>

      <div className="splash-icon">
        <Heart size={32} fill="#1A56DB" />
      </div>

      <div className="splash-loader-track">
        <div className="splash-loader-fill" />
      </div>
    </div>
  );
};

export default SplashScreen;
