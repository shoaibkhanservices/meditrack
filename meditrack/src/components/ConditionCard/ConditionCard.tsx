import { ChevronRight } from 'lucide-react';
import './ConditionCard.css';

interface ConditionCardProps {
  name: string;
  confidence: number;
  description: string;
  learnMoreUrl?: string;
  tags?: string[];
  index?: number;
}

export default function ConditionCard({
  name,
  confidence,
  description,
  learnMoreUrl,
  tags = [],
  index = 0,
}: ConditionCardProps) {
  const getLevel = () => {
    if (confidence < 50) return 'low';
    if (confidence <= 75) return 'mid';
    return 'high';
  };

  const level = getLevel();
  const animDelay = `${index * 0.15}s`;

  return (
    <div
      className="condition-card"
      style={{ animationDelay: animDelay }}
    >
      {/* Header: name + confidence */}
      <div className="condition-card__header">
        <h2 className="condition-card__name">{name}</h2>
        <div>
          <div className={`condition-card__confidence-value condition-card__confidence-value--${level}`}>
            {confidence}%
          </div>
          <div className="condition-card__confidence-label">confidence</div>
        </div>
      </div>

      {/* Animated confidence bar */}
      <div className="condition-card__bar-container">
        <div
          className={`condition-card__bar-fill condition-card__bar-fill--${level}`}
          style={{
            width: `${confidence}%`,
            animationDelay: `${index * 0.15 + 0.3}s`,
          }}
        />
      </div>

      {/* Description */}
      <p className="condition-card__description">{description}</p>

      {/* Footer: tags + learn more */}
      <div className="condition-card__footer">
        {tags.length > 0 && (
          <div className="condition-card__tags">
            {tags.map((tag) => (
              <span key={tag} className="condition-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {learnMoreUrl && (
          <a
            href={learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="condition-card__learn-more"
          >
            Learn More
            <ChevronRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
