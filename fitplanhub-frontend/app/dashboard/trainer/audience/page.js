'use client';

import { useState, useEffect } from 'react';
import { trainerService } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Main page for trainers to see who’s following / paying them.
// This file got a bit long, but splitting it felt premature for now.
export default function TrainerAudience() {
const [followers, setFollowers] = useState([]); // list of people just following
const [subsData, setSubsData] = useState(null); // subscribers + stats (naming could be better)
const [activeTab, setActiveTab] = useState('followers');
const [isLoading, setIsLoading] = useState(true);

const { user } = useAuth();
const router = useRouter();

useEffect(() => {
// Basic guard — if they’re not logged in, kick them out
if (!user) {
router.push('/login');
return;
}

```
// Only trainers should be here
if (user.role === 'trainer') {
  loadAudience(); // naming mismatch vs fetchAudienceData, but it reads nicer
} else {
  router.push('/');
}
// eslint-disable-next-line react-hooks/exhaustive-deps
```

}, [user]);

// Fetch followers + subscribers in parallel
// Could probably split this later if it grows
const loadAudience = async () => {
setIsLoading(true);

```
try {
  const results = await Promise.all([
    trainerService.getMyFollowers(),
    trainerService.getMySubscribers()
  ]);

  const followersRes = results[0];
  const subscribersRes = results[1];

  setFollowers(followersRes?.data?.followers || []);
  setSubsData(subscribersRes?.data || null);
} catch (err) {
  console.error('Error fetching audience data:', err);
  alert('Failed to load audience data'); // simple UX for now
} finally {
  setIsLoading(false);
}
```

};

// Loading state — nothing fancy
if (isLoading) {
return ( <div style={styles.loading}> <div style={styles.spinner}>⏳</div> <p style={styles.loadingText}>Loading your audience...</p> </div>
);
}

// Extra safety check (shouldn’t really hit this often)
if (user?.role !== 'trainer') {
return ( <div style={styles.accessDenied}> <div style={styles.errorIcon}>🚫</div> <h2 style={styles.errorTitle}>Access Denied</h2> <p style={styles.errorText}>
This page is only available for trainers. </p> </div>
);
}

return ( <div style={styles.container}>
{/* Page header */} <div style={styles.header}> <h1 style={styles.heading}>My Audience</h1> <p style={styles.subheading}>
Track your followers and subscribers </p> </div>

```
  {/* Quick stats at the top */}
  <div style={styles.statsGrid}>
    <div style={styles.statCard}>
      <div style={styles.statIcon}>👥</div>
      <div>
        <div style={styles.statValue}>{followers.length}</div>
        <div style={styles.statLabel}>Total Followers</div>
      </div>
    </div>

    <div style={styles.statCard}>
      <div style={styles.statIcon}>⭐</div>
      <div>
        <div style={styles.statValue}>
          {subsData?.totalSubscribers || 0}
        </div>
        <div style={styles.statLabel}>Active Subscribers</div>
      </div>
    </div>

    <div style={styles.statCard}>
      <div style={styles.statIcon}>📊</div>
      <div>
        <div style={styles.statValue}>
          {subsData?.totalSubscriptions || 0}
        </div>
        <div style={styles.statLabel}>Total Subscriptions</div>
      </div>
    </div>
  </div>

  {/* Followers / Subscribers toggle */}
  <div style={styles.tabs}>
    <button
      onClick={() => setActiveTab('followers')}
      style={activeTab === 'followers' ? styles.activeTab : styles.tab}
    >
      👥 Followers ({followers.length})
    </button>

    <button
      onClick={() => setActiveTab('subscribers')}
      style={activeTab === 'subscribers' ? styles.activeTab : styles.tab}
    >
      ⭐ Subscribers ({subsData?.totalSubscribers || 0})
    </button>
  </div>

  {/* Main content */}
  {activeTab === 'followers' && (
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
          {followers.map(f => (
            <div key={f._id} style={styles.userCard}>
              <div style={styles.userAvatar}>
                {f.name?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <h3 style={styles.userName}>{f.name}</h3>
                <p style={styles.userEmail}>{f.email}</p>
                <p style={styles.userDate}>
                  Following since:{' '}
                  {new Date(f.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

  {activeTab === 'subscribers' && (
    <div>
      <h2 style={styles.sectionTitle}>Active Subscribers</h2>

      {subsData?.totalSubscribers === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>⭐</div>
          <h3 style={styles.emptyTitle}>No Subscribers Yet</h3>
          <p style={styles.emptyText}>
            Create compelling plans to attract subscribers!
          </p>
        </div>
      ) : (
        <div>
          {/* Grouped by plan */}
          {Object.entries(subsData?.subscribersByPlan || {}).map(
            ([planId, plan]) => (
              <div key={planId} style={styles.planSection}>
                <div style={styles.planHeader}>
                  <h3 style={styles.planTitle}>{plan.planTitle}</h3>
                  <span style={styles.planBadge}>
                    {plan.subscribers.length} subscriber
                    {plan.subscribers.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={styles.grid}>
                  {plan.subscribers.map((sub, idx) => (
                    <div
                      key={`${sub.userId}-${idx}`}
                      style={styles.subscriberCard}
                    >
                      <div style={styles.userAvatar}>
                        {sub.name?.charAt(0).toUpperCase()}
                      </div>

                      <div style={styles.userInfo}>
                        <h3 style={styles.userName}>{sub.name}</h3>
                        <p style={styles.userEmail}>{sub.email}</p>

                        <div style={styles.subDetails}>
                          <span style={styles.subAmount}>
                            ${sub.amount}
                          </span>
                          <span style={styles.subDates}>
                            {new Date(sub.startDate).toLocaleDateString()} –{' '}
                            {new Date(sub.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )}
</div>

);
}

// Styles live here for now — not perfect, but keeps everything in one file
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
loadingText: {
fontSize: '1rem'
},
accessDenied: {
textAlign: 'center',
padding: '4rem 2rem',
backgroundColor: 'white',
borderRadius: '20px',
maxWidth: '600px',
margin: '4rem auto'
},
errorIcon: { fontSize: '5rem', marginBottom: '1.5rem' },
errorTitle: { fontSize: '1.75rem', fontWeight: 700 },
errorText: { color: '#6B7280' },
header: { marginBottom: '2rem' },
heading: { fontSize: '2.5rem', fontWeight: 800 },
subheading: { color: '#6B7280' },
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
display: 'flex',
gap: '1.5rem',
alignItems: 'center'
},
statIcon: {
fontSize: '3rem'
},
statValue: {
fontSize: '2.5rem',
fontWeight: 800,
color: '#2563EB'
},
statLabel: {
fontSize: '0.875rem',
color: '#6B7280'
},
tabs: {
display: 'flex',
gap: '1rem',
marginBottom: '2rem',
borderBottom: '2px solid #E5E7EB'
},
tab: {
background: 'none',
border: 'none',
padding: '1rem',
cursor: 'pointer',
color: '#6B7280'
},
activeTab: {
background: 'none',
border: 'none',
padding: '1rem',
cursor: 'pointer',
color: '#2563EB',
fontWeight: 700,
borderBottom: '3px solid #2563EB'
},
sectionTitle: {
fontSize: '1.5rem',
fontWeight: 700,
marginBottom: '1.5rem'
},
empty: {
textAlign: 'center',
padding: '4rem 2rem',
backgroundColor: 'white',
borderRadius: '20px'
},
emptyIcon: { fontSize: '5rem' },
emptyTitle: { fontSize: '1.5rem', fontWeight: 700 },
emptyText: { color: '#6B7280' },
grid: {
display: 'grid',
gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
gap: '1.5rem'
},
userCard: {
background: 'white',
padding: '1.5rem',
borderRadius: '16px',
display: 'flex',
gap: '1rem'
},
subscriberCard: {
background: 'white',
padding: '1.5rem',
borderRadius: '16px',
display: 'flex',
gap: '1rem'
},
userAvatar: {
width: '60px',
height: '60px',
borderRadius: '50%',
background: '#2563EB',
color: 'white',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontWeight: 700
},
userInfo: { flex: 1 },
userName: { fontWeight: 700 },
userEmail: { color: '#6B7280', fontSize: '0.875rem' },
userDate: { fontSize: '0.75rem', color: '#9CA3AF' },
planSection: { marginBottom: '3rem' },
planHeader: {
display: 'flex',
justifyContent: 'space-between',
marginBottom: '1.5rem'
},
planTitle: { fontWeight: 700 },
planBadge: {
background: 'white',
padding: '0.5rem 1rem',
borderRadius: '999px'
},
subDetails: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
subAmount: {
fontWeight: 700,
color: '#10B981'
},
subDates: {
fontSize: '0.75rem',
color: '#6B7280'
}
};
