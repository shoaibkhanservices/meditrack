import { useState, useEffect } from 'react';
import { Stethoscope } from 'lucide-react';
import './LoadingAnalysis.css';

const messages = [
  'Analyzing your symptoms...',
  'Consulting medical knowledge...',
  'Preparing your report...',
];

export default function LoadingAnalysis() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-analysis">
      {/* Pulsing Icon with Rings */}
      <div className="loading-analysis__icon-container">
        <div className="loading-analysis__ring" />
        <div className="loading-analysis__ring" />
        <div className="loading-analysis__ring" />
        <div className="loading-analysis__icon-circle">
          <Stethoscope size={36} strokeWidth={1.8} />
        </div>
      </div>

      {/* Heartbeat Line */}
      <svg
        className="loading-analysis__heartbeat"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
      >
        <polyline
          className="loading-analysis__heartbeat-line"
          points="0,20 30,20 40,20 50,8 55,32 60,4 65,36 70,20 80,20 110,20 120,20 130,8 135,32 140,4 145,36 150,20 160,20 200,20"
        />
      </svg>

      {/* Rotating Text */}
      <div className="loading-analysis__text-container">
        <p
          key={messageIndex}
          className="loading-analysis__text"
        >
          {messages[messageIndex]}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="loading-analysis__dots">
        <div className="loading-analysis__dot" />
        <div className="loading-analysis__dot" />
        <div className="loading-analysis__dot" />
      </div>

      {/* Shimmer Bar */}
      <div className="loading-analysis__shimmer-container">
        <div className="loading-analysis__shimmer-bar" />
      </div>

      {/* Brand */}
      <div className="loading-analysis__brand">MediTrack</div>
    </div>
  );
}
