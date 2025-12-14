import { theme } from '../lib/theme';

export default function AchievementBadge({ icon, title, description, unlocked, progress }) {
  const cardStyle = {
    background: unlocked ? 
      'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' : 
      theme.colors.gray200,
    borderRadius: '20px',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    border: `3px solid ${unlocked ? theme.colors.secondary : theme.colors.gray300}`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: unlocked ? theme.shadows.colored : theme.shadows.sm,
  };

  const iconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    filter: unlocked ? 'none' : 'grayscale(100%)',
    opacity: unlocked ? 1 : 0.5,
    display: 'block',
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: unlocked ? theme.colors.white : theme.colors.textSecondary,
  };

  const descriptionStyle = {
    fontSize: '0.85rem',
    color: unlocked ? 'rgba(255, 255, 255, 0.9)' : theme.colors.textLight,
    marginBottom: '1rem',
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    background: unlocked ? 'rgba(255, 255, 255, 0.3)' : theme.colors.gray300,
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '1rem',
  };

  const progressFillStyle = {
    height: '100%',
    width: `${progress}%`,
    background: unlocked ? 
      theme.colors.secondary : 
      theme.colors.primary,
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  };

  return (
    <div style={cardStyle} className="card-hover">
      <span style={iconStyle}>{icon}</span>
      <div style={titleStyle}>{title}</div>
      <div style={descriptionStyle}>{description}</div>
      {progress !== undefined && (
        <div style={progressBarStyle}>
          <div style={progressFillStyle} />
        </div>
      )}
    </div>
  );
}
