import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, ClipboardList } from 'lucide-react';
import SymptomCard from '../../components/SymptomCard/SymptomCard';
import { useSymptomStore } from '../../stores/symptomStore';
import './SymptomDetails.css';

const SymptomDetails = () => {
  const navigate = useNavigate();
  const {
    symptoms,
    updateSymptom,
    freeText,
    setFreeText,
  } = useSymptomStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSteps = symptoms.length + 1; // +1 for general notes
  const isGeneralNotes = currentIndex === symptoms.length;
  const isLastStep = currentIndex === totalSteps - 1;

  if (symptoms.length === 0) {
    return (
      <div className="sd-screen">
        <div className="sd-topbar">
          <button
            type="button"
            className="sd-back-btn"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="sd-topbar-center">
            <span className="sd-topbar-title">Describe Symptoms</span>
          </div>
        </div>
        <div className="sd-empty">
          <ClipboardList size={40} />
          <p>
            No symptoms selected yet. Go back and select symptoms from the body map.
          </p>
          <button
            type="button"
            className="sd-empty-btn"
            onClick={() => navigate('/home')}
          >
            Go to Body Map
          </button>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (isLastStep) {
      navigate('/analyzing');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentSymptom = symptoms[currentIndex];

  return (
    <div className="sd-screen">
      {/* Top bar */}
      <div className="sd-topbar">
        <button
          type="button"
          className="sd-back-btn"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="sd-topbar-center">
          <span className="sd-topbar-title">Describe Symptoms</span>
          <span className="sd-topbar-progress">
            {isGeneralNotes
              ? 'Additional Notes'
              : `Symptom ${currentIndex + 1} of ${symptoms.length}`}
          </span>
        </div>
      </div>

      {/* Dots */}
      <div className="sd-dots">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`sd-dot ${i === currentIndex ? 'active' : ''} ${
              i < currentIndex ? 'done' : ''
            }`}
          />
        ))}
      </div>

      {/* Card area */}
      <div className="sd-card-area">
        {isGeneralNotes ? (
          <div className="sd-general-notes">
            <label htmlFor="general-notes-textarea">
              Anything else you want to share?
            </label>
            <textarea
              id="general-notes-textarea"
              className="sd-general-textarea"
              placeholder="Any additional context, medications you're taking, recent travel, etc."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
            />
          </div>
        ) : (
          <SymptomCard
            key={currentSymptom.symptomId}
            symptomName={currentSymptom.symptomName}
            region={currentSymptom.region}
            severity={currentSymptom.severity}
            duration={currentSymptom.duration}
            freeText={currentSymptom.freeText || ''}
            onSeverityChange={(v) =>
              updateSymptom(currentSymptom.symptomId, { severity: v })
            }
            onDurationChange={(v) =>
              updateSymptom(currentSymptom.symptomId, { duration: v })
            }
            onFreeTextChange={(v) =>
              updateSymptom(currentSymptom.symptomId, { freeText: v })
            }
          />
        )}
      </div>

      {/* Navigation */}
      <div className="sd-nav">
        <button
          type="button"
          className="sd-nav-prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          className={`sd-nav-next ${isLastStep ? 'analyze' : ''}`}
          onClick={handleNext}
        >
          {isLastStep ? (
            <>
              <Sparkles size={18} />
              Analyze My Symptoms
            </>
          ) : (
            <>
              Next
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SymptomDetails;
