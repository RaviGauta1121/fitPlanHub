'use client';

import { useState, useEffect } from 'react';
import { trainerService } from '@/lib/auth';
import PlanCard from '@/components/PlanCard';

export default function Feed() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feed once on mount
  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await trainerService.getFeed();
      setPlans(response.data || []);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Feed</h1>
      <p style={styles.subtitle}>
        Plans shared by trainers you follow
      </p>

      {loading ? (
        <p style={styles.loading}>Loading your feed…</p>
      ) : plans.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>👀</div>
          <p>No plans yet</p>
          <span>Follow trainers to see their plans here</span>
        </div>
      ) : (
        <div style={styles.grid}>
          {plans.map(plan => (
            <div key={plan._id} style={styles.cardWrap}>
              <PlanCard plan={plan} />
            </div>
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
  heading: {
    fontSize: '2.2rem',
    fontWeight: '800',
    marginBottom: '0.25rem'
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: '2rem'
  },
  loading: {
    padding: '2rem',
    color: '#6B7280'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E7EB'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.75rem'
  },
  cardWrap: {
    transition: 'transform 0.25s ease'
  }
};
