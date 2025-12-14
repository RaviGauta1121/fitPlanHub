'use client';

import { useState, useEffect } from 'react';
import { trainerService, subscriptionService } from '@/lib/auth';  // Add subscriptionService
import TrainerCard from '@/components/TrainerCard';
import { useAuth } from '@/context/AuthContext';

export default function MyTrainers() {
  const [followedTrainers, setFollowedTrainers] = useState([]);
  const [subscribedTrainers, setSubscribedTrainers] = useState([]);
  const [activeTab, setActiveTab] = useState('following');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.role === 'user') {
      fetchMyTrainers();
    }
  }, [mounted, user]);

  const fetchMyTrainers = async () => {
    try {
      setLoading(true);
      
      // Get followed trainers
      const followedRes = await trainerService.getFollowedTrainers();
      console.log('Followed trainers response:', followedRes);
      setFollowedTrainers(followedRes.data || []);

      // Get subscribed plans and extract unique trainers
      try {
        const subsRes = await subscriptionService.getUserSubscriptions(); // CHANGED FROM planService
        const trainers = [...new Map(
          (subsRes.data || [])
            .filter(sub => sub.plan?.trainer)
            .map(sub => [sub.plan.trainer._id, sub.plan.trainer])
        ).values()];
        setSubscribedTrainers(trainers);
      } catch (subError) {
        console.error('Error fetching subscriptions:', subError);
        setSubscribedTrainers([]);
      }
      
    } catch (error) {
      console.error('Error fetching trainers:', error);
      alert('Failed to load your trainers: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await trainerService.unfollowTrainer(id);
      setFollowedTrainers(followedTrainers.filter(t => t._id !== id));
    } catch (error) {
      alert('Error unfollowing trainer');
    }
  };

  const handleFollow = async (id) => {
    try {
      await trainerService.followTrainer(id);
      fetchMyTrainers();
    } catch (error) {
      alert('Error following trainer');
    }
  };

  if (!mounted) {
    return null;
  }

  if (user?.role !== 'user') {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.errorIcon}>🚫</div>
        <h2 style={styles.errorTitle}>Access Denied</h2>
        <p style={styles.errorText}>This page is only available for users.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading your trainers...</p>
      </div>
    );
  }

  const displayTrainers = activeTab === 'following' ? followedTrainers : subscribedTrainers;
  const followedIds = followedTrainers.map(t => t._id);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>My Trainers</h1>
        <p style={styles.subheading}>
          Trainers you follow and subscribe to
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('following')}
          style={activeTab === 'following' ? styles.activeTab : styles.tab}
        >
          <span style={styles.tabIcon}>👥</span>
          <span>Following ({followedTrainers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subscribed')}
          style={activeTab === 'subscribed' ? styles.activeTab : styles.tab}
        >
          <span style={styles.tabIcon}>⭐</span>
          <span>Subscribed ({subscribedTrainers.length})</span>
        </button>
      </div>

      {/* Content */}
      {displayTrainers.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            {activeTab === 'following' ? '👥' : '⭐'}
          </div>
          <h2 style={styles.emptyTitle}>
            {activeTab === 'following' 
              ? 'No Trainers Followed Yet' 
              : 'No Active Subscriptions'}
          </h2>
          <p style={styles.emptyText}>
            {activeTab === 'following'
              ? 'Browse trainers and follow the ones you like!'
              : 'Subscribe to plans to see their trainers here!'}
          </p>
          <a href={activeTab === 'following' ? '/trainers' : '/plans'} style={styles.browseBtn}>
            Browse {activeTab === 'following' ? 'Trainers' : 'Plans'}
          </a>
        </div>
      ) : (
        <div style={styles.grid}>
          {displayTrainers.map(trainer => (
            <TrainerCard
              key={trainer._id}
              trainer={trainer}
              isFollowing={followedIds.includes(trainer._id)}
              onFollow={() => handleFollow(trainer._id)}
              onUnfollow={() => handleUnfollow(trainer._id)}
            />
          ))}
        </div>
      )}
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
    minHeight: '400px',
    color: '#6B7280'
  },
  spinner: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  accessDenied: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    maxWidth: '600px',
    margin: '4rem auto'
  },
  errorIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem'
  },
  errorTitle: {
    fontSize: '1.75rem',
    color: '#111827',
    marginBottom: '0.75rem',
    fontWeight: '700'
  },
  errorText: {
    color: '#6B7280',
    fontSize: '1rem'
  },
  header: {
    marginBottom: '2rem'
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 0.5rem 0'
  },
  subheading: {
    fontSize: '1.125rem',
    color: '#6B7280',
    margin: 0
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #E5E7EB',
    paddingBottom: '0'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6B7280',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: '-2px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s'
  },
  activeTab: {
    background: 'none',
    border: 'none',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#2563EB',
    cursor: 'pointer',
    borderBottom: '3px solid #2563EB',
    marginBottom: '-2px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s'
  },
  tabIcon: {
    fontSize: '1.25rem'
  },
  empty: {
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
    fontSize: '1.75rem',
    color: '#111827',
    marginBottom: '0.75rem',
    fontWeight: '700'
  },
  emptyText: {
    color: '#6B7280',
    fontSize: '1.125rem',
    marginBottom: '2rem'
  },
  browseBtn: {
    display: 'inline-block',
    background: '#2563EB',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '2rem'
  }
};
