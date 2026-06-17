import { AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import './UrgencyBanner.css';

type UrgencyLevel = 'EMERGENCY' | 'SEE_DOCTOR_TODAY' | 'MONITOR_AT_HOME' | 'ROUTINE_CHECKUP';

interface UrgencyBannerProps {
  urgencyLevel: UrgencyLevel;
  description: string;
  onAction?: () => void;
}

const urgencyConfig: Record<
  UrgencyLevel,
  {
    label: string;
    Icon: typeof AlertTriangle;
    actionLabel: string;
    cssModifier: string;
  }
> = {
  EMERGENCY: {
    label: 'Emergency',
    Icon: AlertTriangle,
    actionLabel: 'Call 911',
    cssModifier: 'emergency',
  },
  SEE_DOCTOR_TODAY: {
    label: 'See a Doctor Today',
    Icon: AlertTriangle,
    actionLabel: 'Find Clinic',
    cssModifier: 'urgent',
  },
  MONITOR_AT_HOME: {
    label: 'Monitor at Home',
    Icon: Eye,
    actionLabel: 'View Tips',
    cssModifier: 'caution',
  },
  ROUTINE_CHECKUP: {
    label: 'Routine Triage',
    Icon: CheckCircle,
    actionLabel: 'Schedule',
    cssModifier: 'safe',
  },
};

export default function UrgencyBanner({
  urgencyLevel,
  description,
  onAction,
}: UrgencyBannerProps) {
  const config = urgencyConfig[urgencyLevel];
  const { label, Icon, actionLabel, cssModifier } = config;

  return (
    <div className={`urgency-banner ${cssModifier}`}>
      <div className="urgency-banner-content">
        <div className="urgency-banner-icon">
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <div className="urgency-banner-text">
          <h3>{label}</h3>
          <p>{description}</p>
        </div>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          type="button"
          className="urgency-banner-action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
