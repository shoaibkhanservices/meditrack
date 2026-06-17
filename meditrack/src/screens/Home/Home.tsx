import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Check, ArrowRight, MousePointerClick } from 'lucide-react';
import BodyMap from '../../components/BodyMap/BodyMap';
import { useSymptomStore } from '../../stores/symptomStore';
import { bodyRegionSymptoms } from '../../constants/symptoms';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'front' | 'back'>('front');
  const {
    selectedRegions,
    symptoms,
    toggleRegion,
    addSymptom,
    removeSymptom,
  } = useSymptomStore();

  const activeRegionSymptoms = selectedRegions
    .map((regionId) => ({
      regionId,
      regionName: regionId.replace(/_/g, ' '),
      symptoms: bodyRegionSymptoms[regionId] || [],
    }))
    .filter((r) => r.symptoms.length > 0);

  const symptomCount = symptoms.length;

  const handleSymptomToggle = (
    regionId: string,
    symptomId: string,
    symptomName: string
  ) => {
    const isChecked = symptoms.some((s) => s.symptomId === symptomId);
    if (isChecked) {
      removeSymptom(symptomId);
    } else {
      addSymptom({
        region: regionId,
        symptomId,
        symptomName,
        severity: 5,
        duration: 'just_started', // default duration from our durationOptions
        freeText: '',
      });
    }
  };

  return (
    <div className="home-screen">
      {/* Top bar */}
      <div className="home-topbar">
        <div className="home-topbar-logo">
          <span className="medi">Medi</span>
          <span className="track">Track</span>
        </div>
        <button type="button" className="home-profile-btn">
          <User size={18} />
        </button>
      </div>

      {/* Hero */}
      <div className="home-hero">
        <h1>How are you feeling today?</h1>
        <p>Tap on the body areas where you feel discomfort</p>
      </div>

      {/* Body map + symptom sheet */}
      <div className="home-body-map-area">
        <BodyMap
          selectedRegions={selectedRegions}
          onRegionToggle={toggleRegion}
          view={view}
          onViewChange={setView}
        />

        {activeRegionSymptoms.length > 0 ? (
          <div className="home-bottom-sheet">
            <div className="home-sheet-header">
              <span className="home-sheet-title">
                Selected symptoms
                {symptomCount > 0 && (
                  <span className="home-sheet-badge">{symptomCount}</span>
                )}
              </span>
            </div>

            {activeRegionSymptoms.map((region) => (
              <div key={region.regionId} className="home-region-group">
                <h4 className="home-region-group-title">{region.regionName}</h4>
                <div className="home-symptom-checks">
                  {region.symptoms.map((symptom) => {
                    const isChecked = symptoms.some(
                      (s) => s.symptomId === symptom.id
                    );
                    return (
                      <div
                        key={symptom.id}
                        className={`home-symptom-check ${isChecked ? 'checked' : ''}`}
                        onClick={() =>
                          handleSymptomToggle(
                            region.regionId,
                            symptom.id,
                            symptom.name
                          )
                        }
                      >
                        <div className="home-symptom-checkbox">
                          {isChecked && <Check size={14} />}
                        </div>
                        <span className="home-symptom-check-label">
                          {symptom.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty-state">
            <MousePointerClick size={32} />
            <p>
              Select a body region above to start checking your symptoms
            </p>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA - only shown when symptoms are selected */}
      {symptomCount > 0 && (
        <div className="home-bottom-cta">
          <button
            type="button"
            className="home-cta-btn"
            onClick={() => navigate('/symptom-details')}
          >
            Next: Describe Symptoms
            <ArrowRight size={18} />
            <span className="home-cta-badge">{symptomCount}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
