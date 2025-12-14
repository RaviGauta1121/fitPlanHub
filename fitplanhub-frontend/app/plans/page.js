'use client';

import { useState, useEffect } from 'react';
import { planService, subscriptionService } from '../../lib/auth';
import PlanCard from '../../components/PlanCard';
import SearchFilter from '../../components/SearchFilter';
import { useAuth } from '../../context/AuthContext';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const response =
        Object.keys(searchFilters).length > 0
          ? await planService.searchPlans(searchFilters)
          : await planService.getAllPlans();

      setPlans(response.data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchPlans(newFilters);
  };

  const handleSubscribe = async (planId) => {
    try {
      await subscriptionService.subscribe(planId);
      alert('Subscription successful!');
      fetchPlans(filters);
    } catch (err) {
      alert(err.response?.data?.message || 'Subscription failed');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading plans…</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Browse Fitness Plans</h1>

      <SearchFilter onSearch={handleSearch} />

      <p style={styles.count}>
        {plans.length} plan{plans.length !== 1 && 's'} found
      </p>

      {plans.length === 0 ? (
        <div style={styles.empty}>
          <span>😕</span>
          <p>No plans match your filters</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {plans.map(plan => (
            <div key={plan._id} style={styles.cardWrap}>
              <PlanCard
                plan={plan}
                showSubscribe={user?.role === 'user'}
                onSubscribe={handleSubscribe}
              />
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
    marginBottom: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.1rem',
    color: '#6B7280'
  },
  count: {
    fontSize: '0.875rem',
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: '1.5rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E7EB'
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
