'use client';

import { useRouter } from 'next/navigation';
import { theme } from '../lib/theme';

export default function PlanCard({ plan, onSubscribe, showSubscribe = false }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/plans/${plan._id}`);
  };

  const handleSubscribeClick = (e) => {
    e.stopPropagation();
    if (onSubscribe) {
      onSubscribe(plan._id);
    }
  };

  return (
    <div style={styles.card} onClick={handleCardClick}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>{plan.title}</h3>
        {plan.averageRating > 0 && (
          <div style={styles.ratingBadge}>
            ⭐ {plan.averageRating.toFixed(1)}
          </div>
        )}
      </div>
      
      <p style={styles.trainer}>By: {plan.trainer?.name}</p>
      
      <div style={styles.priceSection}>
        <span style={styles.price}>${plan.price}</span>
        <span style={styles.duration}>{plan.duration} days</span>
      </div>
      
      {plan.category && (
        <div style={styles.badges}>
          <span style={styles.categoryBadge}>{plan.category}</span>
          {plan.difficulty && (
            <span style={styles.difficultyBadge}>{plan.difficulty}</span>
          )}
        </div>
      )}
      
      {!plan.preview && plan.description && (
        <p style={styles.description}>{plan.description.substring(0, 100)}...</p>
      )}
      
      {plan.preview && (
        <p style={styles.preview}>🔒 Subscribe to unlock full details</p>
      )}
      
      {showSubscribe && plan.preview && (
        <button onClick={handleSubscribeClick} style={styles.button}>
          Subscribe Now
        </button>
      )}

      <div style={styles.viewDetails}>
        View Details →
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: `1px solid ${theme.colors.gray200}`,
    borderRadius: '0.75rem',
    padding: '1.5rem',
    backgroundColor: theme.colors.bgCard,
    boxShadow: theme.shadows.sm,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '0',
    color: theme.colors.gray900,
    flex: 1
  },
  ratingBadge: {
    backgroundColor: theme.colors.warningLight,
    color: theme.colors.gray800,
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  trainer: {
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
    fontSize: '0.875rem'
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: theme.colors.gray50,
    borderRadius: '0.5rem',
    border: `1px solid ${theme.colors.gray200}`
  },
  price: {
    fontSize: '1.75rem',
    color: theme.colors.primary,
    fontWeight: 'bold'
  },
  duration: {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  badges: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  categoryBadge: {
    backgroundColor: theme.colors.gray800,
    color: theme.colors.white,
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  difficultyBadge: {
    backgroundColor: theme.colors.primaryLighter,
    color: theme.colors.primaryDark,
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  description: {
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.6'
  },
  preview: {
    color: theme.colors.textLight,
    fontStyle: 'italic',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: theme.colors.gray50,
    borderRadius: '0.375rem',
    borderLeft: `3px solid ${theme.colors.primary}`
  },
  button: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: '0.875rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '600',
    fontSize: '0.875rem',
    marginBottom: '0.75rem',
    transition: 'all 0.2s',
    boxShadow: theme.shadows.sm
  },
  viewDetails: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: '0.875rem',
    fontWeight: '600',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: `1px solid ${theme.colors.gray200}`
  }
};
