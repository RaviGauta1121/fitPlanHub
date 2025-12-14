import { theme } from '../lib/theme';

export default function TrainerCard({ trainer, onFollow, isFollowing }) {
  const cardStyle = {
    background: theme.colors.white,
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: theme.shadows.lg,
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    border: `2px solid ${theme.colors.gray200}`,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    margin: '0 auto 1.25rem',
    border: `4px solid ${theme.colors.primary}`,
    background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    boxShadow: theme.shadows.colored,
  };

  const nameStyle = {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: '0.5rem',
  };

  const specialtyStyle = {
    fontSize: '0.95rem',
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
    fontWeight: '500',
  };

  const statsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: theme.colors.bgSecondary,
    borderRadius: '16px',
  };

  const statStyle = {
    textAlign: 'center',
  };

  const statValueStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: theme.colors.primary,
    display: 'block',
  };

  const statLabelStyle = {
    fontSize: '0.75rem',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
  };

  const followButtonStyle = {
    width: '100%',
    padding: '0.85rem',
    background: isFollowing ? theme.colors.gray200 : theme.colors.bgGradient,
    color: isFollowing ? theme.colors.textPrimary : theme.colors.white,
    border: 'none',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isFollowing ? 'none' : theme.shadows.colored,
  };

  return (
    <div style={cardStyle} className="card-hover">
      <div style={avatarStyle}>
        {trainer.avatar || '👤'}
      </div>
      <div style={nameStyle}>{trainer.name}</div>
      <div style={specialtyStyle}>🎯 {trainer.specialty}</div>
      
      <div style={statsContainerStyle}>
        <div style={statStyle}>
          <span style={statValueStyle}>{trainer.clients}</span>
          <span style={statLabelStyle}>Clients</span>
        </div>
        <div style={statStyle}>
          <span style={statValueStyle}>{trainer.rating}⭐</span>
          <span style={statLabelStyle}>Rating</span>
        </div>
        <div style={statStyle}>
          <span style={statValueStyle}>{trainer.experience}y</span>
          <span style={statLabelStyle}>Experience</span>
        </div>
      </div>

      <button
        onClick={() => onFollow(trainer.id)}
        style={followButtonStyle}
      >
        {isFollowing ? '✓ Following' : '+ Follow'}
      </button>
    </div>
  );
}
