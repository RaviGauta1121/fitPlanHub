'use client';

import { useState, useEffect } from 'react';
import { trainerService } from '@/lib/auth';
import TrainerCard from '@/components/TrainerCard';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [followedIds, setFollowedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
    fetchFollowed();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await trainerService.getAllTrainers();
      setTrainers(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowed = async () => {
    try {
      const response = await trainerService.getFollowedTrainers();
      setFollowedIds(response.data.map(t => t._id));
    } catch (error) {
      console.error('Error fetching followed trainers:', error);
    }
  };

  const handleFollow = async (id) => {
    try {
      await trainerService.followTrainer(id);
      setFollowedIds([...followedIds, id]);
    } catch (error) {
      alert('Error following trainer');
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await trainerService.unfollowTrainer(id);
      setFollowedIds(followedIds.filter(tid => tid !== id));
    } catch (error) {
      alert('Error unfollowing trainer');
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Loading trainers...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Expert Trainers</h1>
        <p style={styles.heroSubtitle}>
          Connect with certified fitness professionals and transform your journey
        </p>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <div style={styles.statValue}>{trainers.length}</div>
            <div style={styles.statLabel}>Total Trainers</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✨</div>
          <div>
            <div style={styles.statValue}>{followedIds.length}</div>
            <div style={styles.statLabel}>Following</div>
          </div>
        </div>
      </div>

      {/* Trainers Grid */}
      {trainers.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🏋️</div>
          <h2 style={styles.emptyTitle}>No Trainers Available</h2>
          <p style={styles.emptyText}>Check back soon for expert trainers!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {trainers.map(trainer => (
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
    minHeight: '400px'
  },
  spinner: {
    fontSize: '3rem',
    marginBottom: '1rem',
    animation: 'spin 2s linear infinite'
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '1rem'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 1rem 0',
    letterSpacing: '-1px'
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    color: '#6B7280',
    margin: 0,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6'
  },
  statsBar: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '3rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'white',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB',
    minWidth: '200px'
  },
  statIcon: {
    fontSize: '2.5rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#2563EB',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginTop: '0.25rem',
    fontWeight: '500'
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
    fontSize: '1.125rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '2rem'
  }
};
