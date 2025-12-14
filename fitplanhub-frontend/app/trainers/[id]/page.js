'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trainerService, subscriptionService } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function TrainerProfile() {
  const [trainer, setTrainer] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchTrainerProfile();
    if (user?.role === 'user') {
      checkFollowStatus();
    }
  }, [params.id]);

  const fetchTrainerProfile = async () => {
    try {
      const response = await trainerService.getTrainerById(params.id);
      setTrainer(response.data.trainer);
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching trainer:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await trainerService.getFollowedTrainers();
      const followed = response.data.some(t => t._id === params.id);
      setIsFollowing(followed);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await trainerService.followTrainer(params.id);
      setIsFollowing(true);
      alert('Trainer followed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to follow trainer');
    }
  };

  const handleUnfollow = async () => {
    try {
      await trainerService.unfollowTrainer(params.id);
      setIsFollowing(false);
      alert('Trainer unfollowed');
    } catch (error) {
      alert('Failed to unfollow trainer');
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await subscriptionService.subscribe(planId);
      alert('Subscription successful!');
      fetchTrainerProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Subscription failed');
    }
  };

  const viewPlanDetails = (planId) => {
    router.push(`/plans/${planId}`);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Loading trainer profile...</p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div style={styles.error}>
        <div style={styles.errorIcon}>😔</div>
        <h2 style={styles.errorTitle}>Trainer Not Found</h2>
        <p style={styles.errorText}>The trainer you're looking for doesn't exist.</p>
        <Link href="/trainers" style={styles.backButton}>
          Back to Trainers
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <Link href="/trainers" style={styles.backLink}>
        ← Back to All Trainers
      </Link>

      {/* Profile Header */}
      <div style={styles.profileCard}>
        <div style={styles.gradientBanner}></div>
        
        <div style={styles.profileContent}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {trainer.name.charAt(0).toUpperCase()}
            </div>
            {isFollowing && (
              <div style={styles.followingBadge}>✓ Following</div>
            )}
          </div>

          <div style={styles.profileInfo}>
            <h1 style={styles.name}>{trainer.name}</h1>
            <p style={styles.email}>📧 {trainer.email}</p>
            
            {trainer.certifications && (
              <div style={styles.certBox}>
                <span style={styles.certIcon}>🎓</span>
                <div>
                  <div style={styles.certLabel}>Certifications</div>
                  <div style={styles.certValue}>{trainer.certifications}</div>
                </div>
              </div>
            )}
          </div>

          {user?.role === 'user' && (
            <div style={styles.actions}>
              {isFollowing ? (
                <button onClick={handleUnfollow} style={styles.unfollowButton}>
                  <span>✓</span>
                  <span>Following</span>
                </button>
              ) : (
                <button onClick={handleFollow} style={styles.followButton}>
                  <span>+</span>
                  <span>Follow</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{plans.length}</div>
            <div style={styles.statLabel}>Plans Created</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{trainer.followerCount || 0}</div>
            <div style={styles.statLabel}>Followers</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{trainer.subscriberCount || 0}</div>
            <div style={styles.statLabel}>Subscribers</div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div style={styles.plansSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📋</span>
            Fitness Plans by {trainer.name}
          </h2>
          <div style={styles.planCount}>{plans.length} Plans</div>
        </div>
        
        {plans.length === 0 ? (
          <div style={styles.emptyPlans}>
            <div style={styles.emptyIcon}>📝</div>
            <h3 style={styles.emptyTitle}>No Plans Available Yet</h3>
            <p style={styles.emptyText}>
              This trainer hasn't created any fitness plans yet. Check back soon!
            </p>
          </div>
        ) : (
          <div style={styles.plansGrid}>
            {plans.map(plan => (
              <div key={plan._id} style={styles.planCard}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planTitle}>{plan.title}</h3>
                  <div style={styles.planPrice}>
                    <span style={styles.priceAmount}>${plan.price}</span>
                  </div>
                </div>

                <p style={styles.planDescription}>
                  {plan.description?.substring(0, 150)}
                  {plan.description?.length > 150 ? '...' : ''}
                </p>
                
                <div style={styles.planMeta}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>📅</span>
                    <span style={styles.metaText}>{plan.duration} days</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>⭐</span>
                    <span style={styles.metaText}>{plan.difficulty || 'All Levels'}</span>
                  </div>
                </div>

                <div style={styles.planActions}>
                  <button 
                    onClick={() => viewPlanDetails(plan._id)} 
                    style={styles.viewButton}
                  >
                    View Details
                  </button>
                  
                  {user?.role === 'user' && (
                    <button 
                      onClick={() => handleSubscribe(plan._id)} 
                      style={styles.subscribeButton}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '1rem'
  },
  error: {
    textAlign: 'center',
    padding: '4rem 2rem',
    maxWidth: '600px',
    margin: '4rem auto',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB'
  },
  errorIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem'
  },
  errorTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.75rem'
  },
  errorText: {
    fontSize: '1rem',
    color: '#6B7280',
    marginBottom: '2rem'
  },
  backButton: {
    display: 'inline-block',
    background: '#2563EB',
    color: 'white',
    padding: '0.875rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '600',
    marginBottom: '2rem',
    fontSize: '0.9375rem',
    transition: 'all 0.2s'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB',
    marginBottom: '3rem'
  },
  gradientBanner: {
    height: '160px',
    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
  },
  profileContent: {
    padding: '0 2rem 2rem',
    position: 'relative'
  },
  avatarSection: {
    position: 'relative',
    width: 'fit-content',
    margin: '-80px auto 0'
  },
  avatar: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'white',
    border: '6px solid white',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    fontWeight: '800',
    color: '#2563EB',
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
  },
  followingBadge: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    background: '#10B981',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: '700',
    border: '3px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  },
  profileInfo: {
    textAlign: 'center',
    marginTop: '1.5rem',
    marginBottom: '1.5rem'
  },
  name: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.5px'
  },
  email: {
    fontSize: '1.125rem',
    color: '#6B7280',
    margin: '0 0 1.5rem 0',
    fontWeight: '500'
  },
  certBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    padding: '1rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
  },
  certIcon: {
    fontSize: '2rem'
  },
  certLabel: {
    fontSize: '0.75rem',
    color: '#1E40AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  certValue: {
    fontSize: '1rem',
    color: '#1E3A8A',
    fontWeight: '700',
    marginTop: '0.25rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem'
  },
  followButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#2563EB',
    color: 'white',
    padding: '1rem 3rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.125rem',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s'
  },
  unfollowButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'white',
    color: '#EF4444',
    padding: '1rem 3rem',
    borderRadius: '12px',
    border: '2px solid #EF4444',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.125rem',
    transition: 'all 0.2s'
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '2rem',
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#2563EB',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginTop: '0.5rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statDivider: {
    width: '1px',
    height: '60px',
    background: '#E5E7EB'
  },
  plansSection: {
    marginTop: '3rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  sectionIcon: {
    fontSize: '2rem'
  },
  planCount: {
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    color: '#1E40AF',
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '0.9375rem'
  },
  emptyPlans: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB'
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#111827',
    marginBottom: '0.75rem',
    fontWeight: '700'
  },
  emptyText: {
    color: '#6B7280',
    fontSize: '1rem'
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '2rem'
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s'
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem'
  },
  planTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    flex: 1
  },
  planPrice: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
  },
  priceAmount: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'white'
  },
  planDescription: {
    fontSize: '0.9375rem',
    color: '#6B7280',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  planMeta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #E5E7EB'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  metaIcon: {
    fontSize: '1.25rem'
  },
  metaText: {
    fontSize: '0.875rem',
    color: '#374151',
    fontWeight: '600'
  },
  planActions: {
    display: 'flex',
    gap: '0.75rem'
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    padding: '0.875rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9375rem',
    transition: 'all 0.2s'
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    color: 'white',
    padding: '0.875rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9375rem',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s'
  }
};
