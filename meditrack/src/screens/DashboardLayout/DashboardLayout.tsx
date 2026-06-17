import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ClipboardList, MessageSquare, User } from 'lucide-react';
import Home from '../Home/Home';
import History from '../History/History';
import Assistant from '../Assistant/Assistant';
import Profile from '../Profile/Profile';
import { useAuthStore } from '../../stores/authStore';
import './DashboardLayout.css';

type TabType = 'home' | 'history' | 'assistant' | 'profile';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);

  // Route guarding: if not guest and no token, redirect to auth
  useEffect(() => {
    if (!token && !isGuest) {
      navigate('/auth', { replace: true });
    }
  }, [token, isGuest, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'history':
        return <History />;
      case 'assistant':
        return <Assistant />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  if (!token && !isGuest) {
    return null; // prevent render before redirect
  }

  return (
    <div className="dashboard-layout">
      {/* Content Area */}
      <main className="dashboard-content">{renderContent()}</main>

      {/* Glassmorphic Bottom Navigation Bar */}
      <nav className="dashboard-nav">
        <button
          type="button"
          className={`dashboard-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <HomeIcon size={22} className="dashboard-nav-icon" />
          <span className="dashboard-nav-label">Home</span>
        </button>

        <button
          type="button"
          className={`dashboard-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <ClipboardList size={22} className="dashboard-nav-icon" />
          <span className="dashboard-nav-label">History</span>
        </button>

        <button
          type="button"
          className={`dashboard-nav-item ${activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistant')}
        >
          <MessageSquare size={22} className="dashboard-nav-icon" />
          <span className="dashboard-nav-label">Assistant</span>
        </button>

        <button
          type="button"
          className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={22} className="dashboard-nav-icon" />
          <span className="dashboard-nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
}
