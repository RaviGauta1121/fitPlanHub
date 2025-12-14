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
      let response;
      
      if (Object.keys(searchFilters).length > 0) {
        response = await planService.searchPlans(searchFilters);
      } else {
        response = await planService.getAllPlans();
      }
      
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
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
    } catch (error) {
      alert(error.response?.data?.message || 'Subscription failed');
    }
  };

  if (loading) return <div style={styles.loading}>Loading plans...</div>;

  return (
    <div>
      <h1 style={styles.heading}>Browse Fitness Plans</h1>
      
      <SearchFilter onSearch={handleSearch} />

      <div style={styles.results}>
        <p style={styles.count}>
          {plans.length} plan{plans.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {plans.length === 0 ? (
        <div style={styles.empty}>
          <p>No plans found matching your criteria</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {plans.map(plan => (
            <PlanCard 
              key={plan._id}
              plan={plan}
              showSubscribe={user?.role === 'user'}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#6b7280'
  },
  results: {
    marginBottom: '1rem'
  },
  count: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    color: '#6b7280'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  }
};
