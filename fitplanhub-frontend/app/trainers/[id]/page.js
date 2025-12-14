'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trainerService, subscriptionService } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

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

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!trainer) return <div style={styles.error}>Trainer not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.profileInfo}>
            <h1 style={styles.name}>{trainer.name}</h1>
            <p style={styles.email}>{trainer.email}</p>
            {trainer.certifications && (
              <div style={styles.certBadge}>
                <span style={styles.certLabel}>Certified:</span>
                <span style={styles.certValue}>{trainer.certifications}</span>
              </div>
            )}
          </div>

          {user?.role === 'user' && (
            <div style={styles.actions}>
              {isFollowing ? (
                <button onClick={handleUnfollow} style={styles.unfollowButton}>
                  Unfollow
                </button>
              ) : (
                <button onClick={handleFollow} style={styles.followButton}>
                  Follow
                </button>
              )}
            </div>
          )}
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{plans.length}</span>
            <span style={styles.statLabel}>Plans</span>
          </div>
        </div>
      </div>

      <div style={styles.plansSection}>
        <h2 style={styles.sectionTitle}>Fitness Plans</h2>
        
        {plans.length === 0 ? (
          <p style={styles.emptyMessage}>No plans available yet</p>
        ) : (
          <div style={styles.plansGrid}>
            {plans.map(plan => (
              <div key={plan._id} style={styles.planCard}>
                <h3 style={styles.planTitle}>{plan.title}</h3>
                <p style={styles.planDescription}>{plan.description?.substring(0, 100)}...</p>
                
                <div style={styles.planDetails}>
                  <div style={styles.planPrice}>${plan.price}</div>
                  <div style={styles.planDuration}>{plan.duration} days</div>
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
                      style={styles.subscribeButtonSmall}
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#dc2626'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem'
  },
  profileInfo: {
    flex: 1
  },
  name: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  email: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0 0 1rem 0'
  },
  certBadge: {
    backgroundColor: '#dbeafe',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    display: 'inline-block'
  },
  certLabel: {
    fontSize: '0.875rem',
    color: '#1e40af',
    fontWeight: '600',
    marginRight: '0.5rem'
  },
  certValue: {
    fontSize: '0.875rem',
    color: '#1e3a8a'
  },
  actions: {
    display: 'flex',
    gap: '1rem'
  },
  followButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem'
  },
  unfollowButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem'
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textTransform: 'uppercase'
  },
  plansSection: {
    marginTop: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem'
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  planTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 0.75rem 0'
  },
  planDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  planDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  planPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  planDuration: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '600'
  },
  planActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600'
  },
  subscribeButtonSmall: {
    flex: 1,
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600'
  }
};
