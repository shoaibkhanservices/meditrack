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
    cssModifier: 'see_doctor_today',
  },
  MONITOR_AT_HOME: {
    label: 'Monitor at Home',
    Icon: Eye,
    actionLabel: 'View Tips',
    cssModifier: 'monitor_at_home',
  },
  ROUTINE_CHECKUP: {
    label: 'Routine Checkup',
    Icon: CheckCircle,
    actionLabel: 'Schedule',
    cssModifier: 'routine_checkup',
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
    <div className={`urgency-banner urgency-banner--${cssModifier}`}>
      {/* Icon */}
      <div className="urgency-banner__icon">
        <Icon size={22} strokeWidth={2.5} />
      </div>

      {/* Content */}
      <div className="urgency-banner__content">
        <div className="urgency-banner__level">{label}</div>
        <p className="urgency-banner__description">{description}</p>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          type="button"
          className="urgency-banner__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
