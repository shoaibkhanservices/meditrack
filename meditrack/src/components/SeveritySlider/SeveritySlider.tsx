import './SeveritySlider.css';

interface SeveritySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function SeveritySlider({
  value,
  onChange,
  label,
}: SeveritySliderProps) {
  const fillPercent = ((value - 1) / 9) * 100;

  const getColorClass = () => {
    if (value <= 3) return 'low';
    if (value <= 6) return 'mid';
    return 'high';
  };

  const colorClass = getColorClass();

  return (
    <div className="severity-slider">
      {label && <label className="severity-slider__label">{label}</label>}

      {/* Current Value */}
      <div className="severity-slider__value-display">
        <span className={`severity-slider__value-number severity-slider__value-number--${colorClass}`}>
          {value}
        </span>
        <span className="severity-slider__value-max">/10</span>
      </div>

      {/* Track + Slider */}
      <div className="severity-slider__track-wrapper">
        {/* Background track (grey) */}
        <div className="severity-slider__track-bg" />

        {/* Colored fill portion */}
        <div
          className="severity-slider__track-fill"
          style={{ width: `${fillPercent}%` }}
        />

        {/* Floating number label on thumb */}
        <div
          className="severity-slider__thumb-label"
          style={{ left: `${fillPercent}%` }}
        >
          {value}
        </div>

        {/* Native range input */}
        <input
          type="range"
          className="severity-slider__input"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>

      {/* Tick marks */}
      <div className="severity-slider__ticks">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="severity-slider__tick" />
        ))}
      </div>

      {/* Labels */}
      <div className="severity-slider__labels">
        <span>Mild</span>
        <span>Moderate</span>
        <span>Severe</span>
      </div>
    </div>
  );
}
