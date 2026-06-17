import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import './EmergencyModal.css';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyNumber?: string;
}

export default function EmergencyModal({
  isOpen,
  onClose,
  emergencyNumber = '911',
}: EmergencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="emergency-modal-overlay">
      <div className="emergency-modal-card">
        {/* Warning Icon Glow */}
        <div className="emergency-modal-icon-container">
          <AlertTriangle size={48} className="emergency-modal-icon" />
        </div>

        {/* Text */}
        <h1 className="emergency-modal-title">Seek Immediate Emergency Care</h1>
        <p className="emergency-modal-desc">
          Your reported symptoms indicate a potential medical emergency. Do not wait for further analysis. Please seek professional medical care immediately.
        </p>

        {/* Action Buttons */}
        <div className="emergency-modal-actions">
          <a
            href={`tel:${emergencyNumber}`}
            className="emergency-modal-btn-call"
          >
            <Phone size={18} />
            <span>Call Emergency ({emergencyNumber})</span>
          </a>

          <button
            type="button"
            className="emergency-modal-btn-dismiss"
            onClick={onClose}
          >
            <MapPin size={18} />
            <span>View Nearest Hospitals & Map</span>
          </button>
        </div>

        <p className="emergency-modal-disclaimer">
          MediTrack does not provide clinical diagnosis. Triage assessments are informational only.
        </p>
      </div>
    </div>
  );
}
