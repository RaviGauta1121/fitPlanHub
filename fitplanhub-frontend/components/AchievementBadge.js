import { theme } from '../lib/theme';

export default function AchievementBadge({ icon, title, description, unlocked, progress, onClick }) {
  // Calculate gradient colors based on unlocked state
  const getGradient = () => {
    if (unlocked) {
      return `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || '#8b5cf6'} 100%)`;
    }
    return `linear-gradient(135deg, ${theme.colors.gray200} 0%, ${theme.colors.gray300} 100%)`;
  };

  // Handle click with optional callback
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      style={styles.card(unlocked)} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} achievement - ${unlocked ? 'Unlocked' : 'Locked'}`}
    >
      {/* Decorative background element */}
      <div style={styles.backgroundGlow(unlocked)} />
      
      {/* Icon with progress ring */}
      <div style={styles.iconContainer}>
        <div style={styles.iconWrapper(unlocked)}>
          <span style={styles.icon(unlocked)}>{icon}</span>
        </div>
        
        {/* Circular progress indicator */}
        {progress !== undefined && !unlocked && (
          <div style={styles.progressRing}>
            <div 
              style={styles.progressFill(progress)} 
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        )}
        
        {/* Checkmark for unlocked achievements */}
        {unlocked && (
          <div style={styles.unlockedBadge} aria-hidden="true">
            ✓
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title(unlocked)}>
          {title}
          {unlocked && <span style={styles.unlockedDot} aria-hidden="true" />}
        </h3>
        
        <p style={styles.description(unlocked)}>
          {description}
        </p>
      </div>

      {/* Linear progress bar (for in-progress achievements) */}
      {progress !== undefined && !unlocked && (
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>
            <span>Progress: {progress}%</span>
          </div>
          <div style={styles.progressTrack}>
            <div 
              style={styles.progressBar(progress)} 
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: (unlocked) => ({
    background: unlocked ? 
      'linear-gradient(135deg, #0EA5E915 0%, #0284C705 100%)' : 
      theme.colors.gray50,
    borderRadius: '20px',
    padding: '1.75rem',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: unlocked ? 'pointer' : 'default',
    border: `2px solid ${unlocked ? theme.colors.primary + '30' : theme.colors.gray200}`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: unlocked ? '0 8px 30px rgba(14, 165, 233, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
    transform: unlocked ? 'translateY(-2px)' : 'none',
    ':hover': {
      transform: unlocked ? 'translateY(-4px)' : 'none',
      boxShadow: unlocked ? '0 12px 40px rgba(14, 165, 233, 0.18)' : '0 6px 16px rgba(0, 0, 0, 0.08)',
    },
  }),
  
  backgroundGlow: (unlocked) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: unlocked ? 
      `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || '#8b5cf6'} 100%)` : 
      theme.colors.gray300,
    opacity: unlocked ? 1 : 0.3,
  }),
  
  iconContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconWrapper: (unlocked) => ({
    width: '64px',
    height: '64px',
    background: unlocked ? 
      'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' : 
      theme.colors.gray300,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  }),
  
  icon: (unlocked) => ({
    fontSize: '2.5rem',
    filter: unlocked ? 'none' : 'grayscale(100%) brightness(1.2)',
    opacity: unlocked ? 1 : 0.7,
    display: 'block',
    transition: 'all 0.3s ease',
  }),
  
  unlockedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: theme.colors.success,
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    zIndex: 3,
    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
  },
  
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  
  progressFill: (progress) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(${theme.colors.primary} ${progress}%, transparent ${progress}% 100%)`,
  }),
  
  content: {
    marginBottom: '1rem',
  },
  
  title: (unlocked) => ({
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: unlocked ? theme.colors.gray900 : theme.colors.gray600,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
  
  unlockedDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: theme.colors.success,
    animation: 'pulse 2s infinite',
  },
  
  description: (unlocked) => ({
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: unlocked ? theme.colors.gray700 : theme.colors.gray500,
    marginBottom: '1rem',
  }),
  
  progressContainer: {
    marginTop: '1rem',
  },
  
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.75rem',
    color: theme.colors.gray600,
    fontWeight: '500',
  },
  
  progressTrack: {
    width: '100%',
    height: '8px',
    background: theme.colors.gray200,
    borderRadius: '10px',
    overflow: 'hidden',
  },
  
  progressBar: (progress) => ({
    height: '100%',
    width: `${progress}%`,
    background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || '#8b5cf6'} 100%)`,
    borderRadius: '10px',
    transition: 'width 0.6s ease',
  }),
};