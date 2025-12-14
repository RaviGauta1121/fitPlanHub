'use client';

import { useState, useEffect } from 'react';
import { trainerService } from '@/lib/auth';
import PlanCard from '@/components/PlanCard';

export default function Feed() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await trainerService.getFeed();
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>My Feed</h1>
      <p style={styles.subtitle}>Plans from trainers you follow</p>
      
      {plans.length === 0 ? (
        <p>Follow trainers to see their plans here!</p>
      ) : (
        <div style={styles.grid}>
          {plans.map(plan => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  heading: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  }
};
