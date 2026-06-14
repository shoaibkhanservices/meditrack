import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import UrgencyBanner from '../../components/UrgencyBanner/UrgencyBanner';
import ConditionCard from '../../components/ConditionCard/ConditionCard';
import { useSessionStore } from '../../stores/sessionStore';
import { useSymptomStore } from '../../stores/symptomStore';
import './Results.css';

export default function Results() {
  const navigate = useNavigate();
  const currentResult = useSessionStore((state) => state.currentResult);
  const resetSession = useSessionStore((state) => state.reset);
  const resetSymptoms = useSymptomStore((state) => state.reset);

  const handleNewCheck = () => {
    resetSession();
    resetSymptoms();
    navigate('/home');
  };

  if (!currentResult) {
    return (
      <div className="results-empty">
        <AlertCircle size={48} className="results-empty__icon" />
        <h2>No Results Found</h2>
        <p>Please complete a symptom assessment to view recommendations.</p>
        <button
          type="button"
          className="btn-primary"
          style={{ maxWidth: '240px' }}
          onClick={handleNewCheck}
        >
          Start New Check
        </button>
      </div>
    );
  }

  const getUrgencyDescription = (level: string) => {
    switch (level) {
      case 'EMERGENCY':
        return 'Seek immediate medical attention. Call emergency services or go to the nearest emergency room.';
      case 'SEE_DOCTOR_TODAY':
        return 'We recommend you consult a primary care doctor or visit an urgent care center today.';
      case 'MONITOR_AT_HOME':
        return 'Monitor your symptoms closely and rest. If symptoms worsen, seek medical advice.';
      case 'ROUTINE_CHECKUP':
        return 'Schedule a routine appointment with your doctor at your earliest convenience.';
      default:
        return 'Consult a medical professional for advice.';
    }
  };

  const handleAction = () => {
    if (currentResult.urgencyLevel === 'EMERGENCY') {
      window.open('tel:911');
    } else {
      // Find clinic mock
      alert('Locating nearby clinics and hospitals...');
    }
  };

  return (
    <div className="results-screen">
      {/* Top bar */}
      <div className="results-topbar">
        <div className="results-topbar__logo">
          <span className="medi">Medi</span>
          <span className="track">Track</span>
        </div>
        <div className="results-topbar__title">Assessment Results</div>
        <button
          type="button"
          className="results-new-btn"
          onClick={handleNewCheck}
        >
          <RefreshCw size={16} />
          <span>New Check</span>
        </button>
      </div>

      <div className="results-container">
        {/* Main Grid */}
        <div className="results-grid">
          {/* Main Column */}
          <main className="results-main">
            {/* Urgency Banner */}
            <UrgencyBanner
              urgencyLevel={currentResult.urgencyLevel}
              description={getUrgencyDescription(currentResult.urgencyLevel)}
              onAction={handleAction}
            />

            {/* Possible Conditions */}
            <section className="results-section">
              <h2 className="results-section-title">Possible Conditions</h2>
              <div className="results-conditions-list">
                {currentResult.conditions.map((condition, index) => (
                  <ConditionCard
                    key={condition.name}
                    name={condition.name}
                    confidence={condition.confidence}
                    description={condition.description}
                    learnMoreUrl={condition.learnMoreUrl}
                    tags={condition.tags}
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* Key Symptoms */}
            <section className="results-section">
              <h2 className="results-section-title">Key Symptoms Identified</h2>
              <div className="results-symptoms-chips">
                {currentResult.keySymptoms.map((symptom) => (
                  <span key={symptom} className="results-symptom-chip">
                    {symptom}
                  </span>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar Column */}
          <aside className="results-sidebar">
            {/* Recommendations Card */}
            <div className="results-card results-card--recommendations">
              <h3>What to do now</h3>
              <ul className="results-rec-list">
                {currentResult.recommendations.map((rec) => (
                  <li key={rec}>
                    <CheckCircle size={16} className="results-rec-icon" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Find Doctor Map Card */}
            <div className="results-card results-card--map">
              <h3>Find Care Nearby</h3>
              <div className="results-map-placeholder">
                <div className="results-map-visual">
                  <div className="results-map-pulse" />
                  <MapPin size={24} className="results-map-marker" />
                </div>
                <div className="results-map-info">
                  <p className="results-map-heading">Nearest Medical Facilities</p>
                  <p className="results-map-sub">3 clinics available within 2 miles</p>
                </div>
              </div>
              <button
                type="button"
                className="results-map-btn"
                onClick={handleAction}
              >
                <MapPin size={16} />
                <span>Open Map Directory</span>
              </button>
            </div>

            {/* Emergency Contacts */}
            {currentResult.emergencyContact && (
              <div className="results-card results-card--emergency">
                <h3>Emergency Contact</h3>
                <p>If you experience difficulty breathing, sudden severe pain, or confusion, call emergency services immediately.</p>
                <a
                  href={`tel:${currentResult.emergencyContact}`}
                  className="results-emergency-btn"
                >
                  <Phone size={16} />
                  <span>Call Emergency ({currentResult.emergencyContact})</span>
                </a>
              </div>
            )}
          </aside>
        </div>

        {/* Disclaimer Footer */}
        <footer className="results-disclaimer-section">
          <AlertCircle size={16} className="results-disclaimer-icon" />
          <p>{currentResult.disclaimer}</p>
        </footer>
      </div>

      <div className="results-save-bar">
        <button
          type="button"
          className="results-save-btn"
          onClick={() => alert('Demo Feature: PDF report generated and downloaded successfully.')}
        >
          <FileText size={18} />
          <span>Download PDF Report</span>
        </button>
      </div>
    </div>
  );
}
