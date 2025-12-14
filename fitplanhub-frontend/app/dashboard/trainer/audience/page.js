'use client';

import { useState, useEffect } from 'react';
import { trainerService } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TrainerAudience() {
  const [followers, setFollowers] = useState([]);
  const [subscribers, setSubscribers] = useState(null);
  const [activeTab, setActiveTab] = useState('followers');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user?.role === 'trainer') {
      fetchAudienceData();
    } else {
      router.push('/');
    }
  }, [user]);

  const fetchAudienceData = async () => {
    try {
      setLoading(true);
      const [followersRes, subscribersRes] = await Promise.all([
        trainerService.getMyFollowers(),
        trainerService.getMySubscribers()
      ]);

      setFollowers(followersRes.data.followers || []);
      setSubscribers(subscribersRes.data);
    } catch (error) {
      console.error('Error fetching audience data:', error);
      alert('Failed to load audience data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Loading your audience...</p>
      </div>
    );
  }

  if (user?.role !== 'trainer') {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.errorIcon}>🚫</div>
        <h2 style={styles.errorTitle}>Access Denied</h2>
        <p style={styles.errorText}>This page is only available for trainers.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>My Audience</h1>
          <p style={styles.subheading}>
            Track your followers and subscribers
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{followers.length}</div>
            <div style={styles.statLabel}>Total Followers</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{subscribers?.totalSubscribers || 0}</div>
            <div style={styles.statLabel}>Active Subscribers</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{subscribers?.totalSubscriptions || 0}</div>
            <div style={styles.statLabel}>Total Subscriptions</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('followers')}
          style={activeTab === 'followers' ? styles.activeTab : styles.tab}
        >
          <span style={styles.tabIcon}>👥</span>
          <span>Followers ({followers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          style={activeTab === 'subscribers' ? styles.activeTab : styles.tab}
        >
          <span style={styles.tabIcon}>⭐</span>
          <span>Subscribers ({subscribers?.totalSubscribers || 0})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'followers' ? (
        <div>
          <h2 style={styles.sectionTitle}>People Following You</h2>
          {followers.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>👥</div>
              <h3 style={styles.emptyTitle}>No Followers Yet</h3>
              <p style={styles.emptyText}>
                Keep creating great content to attract followers!
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {followers.map(follower => (
                <div key={follower._id} style={styles.userCard}>
                  <div style={styles.userAvatar}>
                    {follower.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.userInfo}>
                    <h3 style={styles.userName}>{follower.name}</h3>
                    <p style={styles.userEmail}>{follower.email}</p>
                    <p style={styles.userDate}>
                      Following since: {new Date(follower.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 style={styles.sectionTitle}>Active Subscribers</h2>
          {subscribers?.totalSubscribers === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>⭐</div>
              <h3 style={styles.emptyTitle}>No Subscribers Yet</h3>
              <p style={styles.emptyText}>
                Create compelling plans to attract subscribers!
              </p>
            </div>
          ) : (
            <div>
              {/* By Plan View */}
              {Object.entries(subscribers?.subscribersByPlan || {}).map(([planId, planData]) => (
                <div key={planId} style={styles.planSection}>
                  <div style={styles.planHeader}>
                    <h3 style={styles.planTitle}>{planData.planTitle}</h3>
                    <span style={styles.planBadge}>
                      {planData.subscribers.length} subscriber{planData.subscribers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={styles.grid}>
                    {planData.subscribers.map((sub, index) => (
                      <div key={`${sub.userId}-${index}`} style={styles.subscriberCard}>
                        <div style={styles.userAvatar}>
                          {sub.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.userInfo}>
                          <h3 style={styles.userName}>{sub.name}</h3>
                          <p style={styles.userEmail}>{sub.email}</p>
                          <div style={styles.subDetails}>
                            <span style={styles.subAmount}>${sub.amount}</span>
                            <span style={styles.subDates}>
                              {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
    marginBottom: '1rem',
    animation: 'spin 2s linear infinite'
  },
  loadingText: {
    fontSize: '1rem',
    color: '#6B7280'
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    transition: 'all 0.3s'
  },
  statIcon: {
    fontSize: '3rem',
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statContent: {
    flex: 1
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
    fontWeight: '600'
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
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1.5rem'
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
    fontSize: '1.5rem',
    color: '#111827',
    marginBottom: '0.75rem',
    fontWeight: '700'
  },
  emptyText: {
    color: '#6B7280',
    fontSize: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  userCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    transition: 'all 0.2s'
  },
  subscriberCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E5E7EB',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    transition: 'all 0.2s'
  },
  userAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
    flexShrink: 0
  },
  userInfo: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.25rem 0'
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: '0 0 0.5rem 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  userDate: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    margin: 0
  },
  planSection: {
    marginBottom: '3rem'
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    borderRadius: '12px',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  planTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1E40AF',
    margin: 0
  },
  planBadge: {
    background: 'white',
    color: '#2563EB',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: '700'
  },
  subDetails: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap'
  },
  subAmount: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#10B981',
    background: '#D1FAE5',
    padding: '0.25rem 0.75rem',
    borderRadius: '6px'
  },
  subDates: {
    fontSize: '0.75rem',
    color: '#6B7280'
  }
};
