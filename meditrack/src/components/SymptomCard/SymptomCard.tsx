import { ChevronDown } from 'lucide-react';
import SeveritySlider from '../SeveritySlider/SeveritySlider';
import './SymptomCard.css';

interface SymptomCardProps {
  symptomName: string;
  region: string;
  severity: number;
  duration: string;
  freeText: string;
  onSeverityChange: (v: number) => void;
  onDurationChange: (v: string) => void;
  onFreeTextChange: (v: string) => void;
}

const durationOptions = [
  'Just started',
  'A few hours',
  '1-3 days',
  '4-7 days',
  '1-2 weeks',
  'More than 2 weeks',
];

const MAX_CHARS = 500;

export default function SymptomCard({
  symptomName,
  region,
  severity,
  duration,
  freeText,
  onSeverityChange,
  onDurationChange,
  onFreeTextChange,
}: SymptomCardProps) {
  const charCount = freeText.length;
  const charCountClass =
    charCount >= MAX_CHARS
      ? 'symptom-card__char-count--at-limit'
      : charCount >= MAX_CHARS * 0.85
        ? 'symptom-card__char-count--near-limit'
        : '';

  const regionLabel = region.replace(/_/g, ' ');

  return (
    <div className="symptom-card">
      {/* Header */}
      <div className="symptom-card__header">
        <h3 className="symptom-card__name">{symptomName}</h3>
        <span className="symptom-card__region-badge">{regionLabel}</span>
      </div>

      {/* Severity Section */}
      <div className="symptom-card__section">
        <SeveritySlider
          value={severity}
          onChange={onSeverityChange}
          label="Pain Severity"
        />
      </div>

      <hr className="symptom-card__divider" />

      {/* Duration Section */}
      <div className="symptom-card__section">
        <label className="symptom-card__section-label">
          How long have you experienced this?
        </label>
        <div className="symptom-card__select-wrapper">
          <select
            className="symptom-card__select"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
          >
            <option value="" disabled>
              Select duration...
            </option>
            {durationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="symptom-card__select-icon"
          />
        </div>
      </div>

      <hr className="symptom-card__divider" />

      {/* Free Text Section */}
      <div className="symptom-card__section">
        <label className="symptom-card__section-label">
          Additional details (optional)
        </label>
        <div className="symptom-card__textarea-wrapper">
          <textarea
            className="symptom-card__textarea"
            placeholder="Describe the symptom in more detail — when it happens, what makes it better or worse..."
            value={freeText}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                onFreeTextChange(e.target.value);
              }
            }}
            maxLength={MAX_CHARS}
          />
          <div className={`symptom-card__char-count ${charCountClass}`}>
            {charCount}/{MAX_CHARS}
          </div>
        </div>
      </div>
    </div>
  );
}
