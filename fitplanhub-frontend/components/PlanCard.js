'use client';

import { useRouter } from 'next/navigation';
import { theme } from '../lib/theme';
import { useState } from 'react';

export default function PlanCard({ plan, onSubscribe, showSubscribe = false }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/plans/${plan._id}`);
  };

  const handleSubscribeClick = (e) => {
    e.stopPropagation();
    if (onSubscribe && plan.preview) {
      onSubscribe(plan._id);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      intermediate: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
      advanced: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    };
    return colors[difficulty] || { bg: '#e5e7eb', text: '#4b5563', border: '#9ca3af' };
  };

  const difficultyColors = plan.difficulty ? getDifficultyColor(plan.difficulty) : null;

  return (
    <div 
      style={styles.card(isHovered, plan.preview)}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`plan-title-${plan._id}`}
    >
      {/* Plan header with image placeholder */}
      <div style={styles.cardHeader}>
        <div style={styles.imagePlaceholder}>
          {plan.category?.charAt(0).toUpperCase() || 'F'}
        </div>
        
        <div style={styles.headerContent}>
          <div style={styles.titleRow}>
            <h3 id={`plan-title-${plan._id}`} style={styles.title}>
              {plan.title}
            </h3>
            
            {plan.averageRating > 0 && (
              <div style={styles.ratingContainer}>
                <div style={styles.ratingBadge}>
                  ⭐ {plan.averageRating.toFixed(1)}
                  <span style={styles.ratingCount}>
                    ({plan.reviewCount || 0})
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div style={styles.trainerInfo}>
            <span style={styles.trainerLabel}>By</span>
            <span style={styles.trainerName}>{plan.trainer?.name || 'Unknown Trainer'}</span>
          </div>
        </div>
      </div>

      {/* Price and duration */}
      <div style={styles.priceSection}>
        <div style={styles.priceContainer}>
          <span style={styles.price}>{formatPrice(plan.price)}</span>
          <span style={styles.priceLabel}>one-time payment</span>
        </div>
        
        <div style={styles.durationContainer}>
          <span style={styles.duration}>{plan.duration || 30} days</span>
          <span style={styles.durationLabel}>program length</span>
        </div>
      </div>

      {/* Category and difficulty badges */}
      <div style={styles.badges}>
        {plan.category && (
          <span style={styles.categoryBadge}>
            {plan.category.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
        )}
        
        {plan.difficulty && difficultyColors && (
          <span 
            style={styles.difficultyBadge(difficultyColors)}
            aria-label={`Difficulty level: ${plan.difficulty}`}
          >
            {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
          </span>
        )}
      </div>

      {/* Description or preview message */}
      <div style={styles.contentArea}>
        {!plan.preview && plan.description ? (
          <p style={styles.description}>
            {plan.description.substring(0, 120)}
            {plan.description.length > 120 ? '…' : ''}
          </p>
        ) : plan.preview ? (
          <div style={styles.previewContainer}>
            <div style={styles.lockIcon}>🔒</div>
            <p style={styles.previewText}>
              Subscribe to unlock full workout details, nutrition guide, and trainer support
            </p>
          </div>
        ) : null}
      </div>

      {/* CTA Button */}
      {showSubscribe && plan.preview && (
        <div style={styles.buttonContainer}>
          <button 
            onClick={handleSubscribeClick}
            style={styles.subscribeButton}
            aria-label={`Subscribe to ${plan.title} for ${formatPrice(plan.price)}`}
          >
            <span style={styles.buttonText}>Subscribe Now</span>
            <span style={styles.buttonPrice}>{formatPrice(plan.price)}</span>
          </button>
        </div>
      )}

      {/* View details link */}
      <div style={styles.footer}>
        <span style={styles.viewDetails}>
          View full details
          <span style={styles.arrowIcon} aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: (isHovered, isPreview) => ({
    background: theme.colors.white,
    border: `1px solid ${theme.colors.gray200}`,
    borderRadius: '16px',
    padding: '1.75rem',
    boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    transform: isHovered ? 'translateY(-4px)' : 'none',
    opacity: isPreview ? 0.95 : 1,
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: isPreview ? 
        `linear-gradient(90deg, ${theme.colors.gray400}, ${theme.colors.gray500})` : 
        `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary || '#8b5cf6'})`,
      opacity: isPreview ? 0.5 : 1,
    },
  }),
  
  cardHeader: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.25rem',
    alignItems: 'flex-start',
  },
  
  imagePlaceholder: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: theme.colors.primary,
    flexShrink: 0,
  },
  
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: theme.colors.gray900,
    lineHeight: 1.3,
    margin: 0,
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
  ratingContainer: {
    flexShrink: 0,
  },
  
  ratingBadge: {
    backgroundColor: theme.colors.warningLight,
    color: theme.colors.gray800,
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    whiteSpace: 'nowrap',
  },
  
  ratingCount: {
    fontSize: '0.75rem',
    opacity: 0.8,
  },
  
  trainerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  
  trainerLabel: {
    color: theme.colors.gray500,
  },
  
  trainerName: {
    color: theme.colors.gray700,
    fontWeight: '500',
  },
  
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    padding: '1rem',
    backgroundColor: theme.colors.gray50,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.gray200}`,
  },
  
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  
  price: {
    fontSize: '1.75rem',
    color: theme.colors.primary,
    fontWeight: '800',
    lineHeight: 1,
  },
  
  priceLabel: {
    fontSize: '0.75rem',
    color: theme.colors.gray500,
    marginTop: '0.25rem',
  },
  
  durationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  
  duration: {
    fontSize: '1rem',
    fontWeight: '700',
    color: theme.colors.gray800,
  },
  
  durationLabel: {
    fontSize: '0.75rem',
    color: theme.colors.gray500,
    marginTop: '0.25rem',
  },
  
  badges: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  
  categoryBadge: {
    backgroundColor: theme.colors.gray100,
    color: theme.colors.gray700,
    padding: '0.5rem 0.875rem',
    borderRadius: '8px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    border: `1px solid ${theme.colors.gray200}`,
  },
  
  difficultyBadge: (colors) => ({
    backgroundColor: colors.bg,
    color: colors.text,
    padding: '0.5rem 0.875rem',
    borderRadius: '8px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    border: `1px solid ${colors.border}`,
  }),
  
  contentArea: {
    marginBottom: '1.5rem',
    minHeight: '60px',
  },
  
  description: {
    color: theme.colors.gray600,
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
  previewContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: theme.colors.gray50,
    borderRadius: '12px',
    border: `1px dashed ${theme.colors.gray300}`,
  },
  
  lockIcon: {
    fontSize: '1.25rem',
    opacity: 0.6,
  },
  
  previewText: {
    color: theme.colors.gray600,
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: 1.5,
    flex: 1,
  },
  
  buttonContainer: {
    marginBottom: '1rem',
  },
  
  subscribeButton: {
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || '#8b5cf6'} 100%)`,
    color: theme.colors.white,
    padding: '1rem',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
    },
  },
  
  buttonText: {
    fontSize: '0.9375rem',
    fontWeight: '600',
  },
  
  buttonPrice: {
    fontSize: '0.875rem',
    opacity: 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
  },
  
  footer: {
    paddingTop: '1rem',
    borderTop: `1px solid ${theme.colors.gray200}`,
  },
  
  viewDetails: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: theme.colors.primary,
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  
  arrowIcon: {
    transition: 'transform 0.2s ease',
  },
};