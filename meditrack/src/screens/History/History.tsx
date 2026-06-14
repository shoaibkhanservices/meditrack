import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, ChevronRight, Info } from 'lucide-react';
import { getSessions, deleteSession } from '../../services/supabaseService';
import { useAuthStore } from '../../stores/authStore';
import { useSessionStore } from '../../stores/sessionStore';
import { urgencyColors } from '../../constants/colors';
import type { AnalysisResult } from '../../types';
import './History.css';

interface SessionRecord {
  id: string;
  email: string;
  result: AnalysisResult;
  createdAt: string;
}

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const setResult = useSessionStore((state) => state.setResult);

  const userEmail = isGuest ? 'guest' : user?.email || 'unknown';

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions(userEmail);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load session history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [userEmail]);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // prevent card click navigation
    if (window.confirm('Are you sure you want to delete this assessment from your history?')) {
      try {
        await deleteSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const handleCardClick = (result: AnalysisResult) => {
    setResult(result);
    navigate('/results');
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUrgencyConfig = (level: string) => {
    // fallback config in case colors map has minor structural difference
    const colors = urgencyColors[level as keyof typeof urgencyColors] || {
      bg: '#CA8A04',
      text: '#FFFFFF',
      label: level,
    };
    return colors;
  };

  return (
    <div className="history-screen">
      {/* Top Header */}
      <div className="history-header">
        <h1 className="history-title">Assessment History</h1>
        <span className="history-subtitle">
          {isGuest ? 'Guest Sessions' : `${user?.fullName}'s reports`}
        </span>
      </div>

      {loading ? (
        <div className="history-loading">
          <div className="history-spinner" />
          <p>Retrieving your assessment history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="history-empty">
          <Info size={40} className="history-empty-icon" />
          <h2>No Reports Saved</h2>
          <p>
            Your completed health assessments will appear here. Start a check on the
            Home tab to begin.
          </p>
          {isGuest && (
            <div className="history-guest-notice">
              <strong>Note:</strong> Since you are logged in as a guest, reports are saved
              only on this browser. Create an account to sync history across devices.
            </div>
          )}
        </div>
      ) : (
        <div className="history-list">
          {sessions.map(({ id, result, createdAt }) => {
            const urgency = getUrgencyConfig(result.urgencyLevel);
            return (
              <div
                key={id}
                className="history-card"
                onClick={() => handleCardClick(result)}
              >
                {/* Top Section */}
                <div className="history-card-top">
                  <div className="history-card-date">
                    <Calendar size={14} />
                    <span>{formatDate(createdAt)}</span>
                  </div>
                  <button
                    type="button"
                    className="history-card-delete-btn"
                    onClick={(e) => handleDelete(e, id)}
                    aria-label="Delete assessment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Info Section */}
                <div className="history-card-details">
                  <h2 className="history-card-urgency" style={{ color: urgency.bg }}>
                    {urgency.label}
                  </h2>
                  <div className="history-card-conditions">
                    {result.conditions.slice(0, 2).map((c) => (
                      <span key={c.name} className="history-card-condition-item">
                        {c.name} ({c.confidence}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key symptoms chips */}
                <div className="history-card-symptoms">
                  {result.keySymptoms.map((sym) => (
                    <span key={sym} className="history-card-chip">
                      {sym}
                    </span>
                  ))}
                </div>

                <div className="history-card-footer">
                  <span className="history-card-view-link">View Detailed Report</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
