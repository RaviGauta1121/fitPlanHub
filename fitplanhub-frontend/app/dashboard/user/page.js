'use client';

import { useState, useEffect } from 'react';
import { subscriptionService, workoutLogService, achievementService } from '../../../lib/auth';
import { useAuth } from '../../../context/AuthContext';
import StatsCard from '../../../components/StatsCard';
import WorkoutLogCard from '../../../components/WorkoutLogCard';
import AchievementBadge from '../../../components/AchievementBadge';

export default function UserDashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const [logData, setLogData] = useState({
    duration: '',
    caloriesBurned: '',
    notes: '',
    mood: 'good',
    exercises: []
  });

  useEffect(() => {
    if (user?.role === 'user') {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      // First fetch subscriptions
      const subsRes = await subscriptionService.getUserSubscriptions();
      console.log('Subscriptions:', subsRes.data); // Debug log
      setSubscriptions(subsRes.data);

      // Then fetch other data (with fallback for empty responses)
      try {
        const statsRes = await workoutLogService.getStats();
        setStats(statsRes.data);
      } catch (error) {
        console.log('No workout stats yet');
        setStats({
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          averageDuration: 0,
          workoutsThisWeek: 0,
          workoutsThisMonth: 0
        });
      }

      try {
        const logsRes = await workoutLogService.getUserLogs({ limit: 10 });
        setRecentLogs(logsRes.data);
      } catch (error) {
        console.log('No workout logs yet');
        setRecentLogs([]);
      }

      try {
        const achievementsRes = await achievementService.getUserAchievements();
        setAchievements(achievementsRes.data);
      } catch (error) {
        console.log('No achievements yet');
        setAchievements([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }

    try {
      await workoutLogService.createLog({
        planId: selectedPlan,
        ...logData,
        duration: Number(logData.duration),
        caloriesBurned: Number(logData.caloriesBurned) || 0
      });
      alert('Workout logged successfully! 🎉');
      setShowLogForm(false);
      setLogData({
        duration: '',
        caloriesBurned: '',
        notes: '',
        mood: 'good',
        exercises: []
      });
      setSelectedPlan('');
      fetchAllData();
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Error logging workout: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteLog = async (logId) => {
    if (confirm('Delete this workout log?')) {
      try {
        await workoutLogService.deleteLog(logId);
        fetchAllData();
      } catch (error) {
        alert('Failed to delete log');
      }
    }
  };

  const addExercise = () => {
    setLogData({
      ...logData,
      exercises: [
        ...logData.exercises,
        { exerciseName: '', setsCompleted: '', repsCompleted: '', weight: '' }
      ]
    });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...logData.exercises];
    newExercises[index][field] = value;
    setLogData({ ...logData, exercises: newExercises });
  };

  const removeExercise = (index) => {
    const newExercises = logData.exercises.filter((_, i) => i !== index);
    setLogData({ ...logData, exercises: newExercises });
  };

  if (user?.role !== 'user') {
    return <div>Access denied</div>;
  }

  // Get active subscriptions
  const activePlans = subscriptions.filter(sub => 
    new Date(sub.endDate) > new Date()
  );

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>My Dashboard</h1>
        <button 
          onClick={() => setShowLogForm(!showLogForm)} 
          style={styles.logButton}
          disabled={activePlans.length === 0}
        >
          {showLogForm ? 'Cancel' : '+ Log Workout'}
        </button>
      </div>

      {/* Show message if no active subscriptions */}
      {activePlans.length === 0 && (
        <div style={styles.noPlansMessage}>
          <p>⚠️ You don't have any active subscriptions. Subscribe to a plan to start logging workouts!</p>
        </div>
      )}

      {/* Workout Log Form */}
      {showLogForm && activePlans.length > 0 && (
        <div style={styles.logForm}>
          <h2 style={styles.formTitle}>Log Your Workout</h2>
          <form onSubmit={handleLogWorkout}>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">Select a plan ({activePlans.length} active)</option>
              {activePlans.map(sub => (
                <option key={sub._id} value={sub.plan._id}>
                  {sub.plan.title}
                </option>
              ))}
            </select>

            <div style={styles.formRow}>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={logData.duration}
                onChange={(e) => setLogData({...logData, duration: e.target.value})}
                style={styles.input}
                required
                min="1"
              />
              <input
                type="number"
                placeholder="Calories Burned (optional)"
                value={logData.caloriesBurned}
                onChange={(e) => setLogData({...logData, caloriesBurned: e.target.value})}
                style={styles.input}
                min="0"
              />
            </div>

            <select
              value={logData.mood}
              onChange={(e) => setLogData({...logData, mood: e.target.value})}
              style={styles.input}
            >
              <option value="excellent">😄 Excellent</option>
              <option value="good">😊 Good</option>
              <option value="average">😐 Average</option>
              <option value="tired">😓 Tired</option>
              <option value="exhausted">😫 Exhausted</option>
            </select>

            <div style={styles.exercisesSection}>
              <div style={styles.exercisesHeader}>
                <h3 style={styles.exercisesTitle}>Exercises (Optional)</h3>
                <button type="button" onClick={addExercise} style={styles.addExerciseBtn}>
                  + Add Exercise
                </button>
              </div>

              {logData.exercises.length === 0 && (
                <p style={styles.noExercises}>No exercises added yet. Click "Add Exercise" to add one.</p>
              )}

              {logData.exercises.map((exercise, index) => (
                <div key={index} style={styles.exerciseRow}>
                  <input
                    type="text"
                    placeholder="Exercise name"
                    value={exercise.exerciseName}
                    onChange={(e) => updateExercise(index, 'exerciseName', e.target.value)}
                    style={styles.exerciseInput}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    value={exercise.setsCompleted}
                    onChange={(e) => updateExercise(index, 'setsCompleted', e.target.value)}
                    style={styles.exerciseInputSmall}
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={exercise.repsCompleted}
                    onChange={(e) => updateExercise(index, 'repsCompleted', e.target.value)}
                    style={styles.exerciseInputSmall}
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={exercise.weight}
                    onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                    style={styles.exerciseInputSmall}
                    min="0"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeExercise(index)} 
                    style={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Notes (optional)"
              value={logData.notes}
              onChange={(e) => setLogData({...logData, notes: e.target.value})}
              style={styles.textarea}
            />

            <button type="submit" style={styles.submitButton}>
              Save Workout
            </button>
          </form>
        </div>
      )}

      {/* Rest of the component remains the same... */}
      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('overview')}
          style={activeTab === 'overview' ? styles.activeTab : styles.tab}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('workouts')}
          style={activeTab === 'workouts' ? styles.activeTab : styles.tab}
        >
          Workout History
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          style={activeTab === 'subscriptions' ? styles.activeTab : styles.tab}
        >
          My Plans
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          style={activeTab === 'achievements' ? styles.activeTab : styles.tab}
        >
          Achievements
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {stats && (
            <div style={styles.statsGrid}>
              <StatsCard
                title="Total Workouts"
                value={stats.totalWorkouts}
                icon="🏋️"
                subtitle="All time"
              />
              <StatsCard
                title="This Week"
                value={stats.workoutsThisWeek}
                icon="📅"
                subtitle={`${stats.workoutsThisMonth} this month`}
              />
              <StatsCard
                title="Total Time"
                value={`${Math.round(stats.totalDuration / 60)}h`}
                icon="⏱️"
                subtitle={`${Math.round(stats.averageDuration)} min avg`}
              />
              <StatsCard
                title="Calories Burned"
                value={stats.totalCalories.toLocaleString()}
                icon="🔥"
                subtitle="Total"
              />
            </div>
          )}

          <h2 style={styles.subheading}>Recent Workouts</h2>
          {recentLogs.length === 0 ? (
            <div style={styles.empty}>
              <p>No workouts logged yet. Start by logging your first workout!</p>
            </div>
          ) : (
            <div style={styles.logsGrid}>
              {recentLogs.slice(0, 5).map(log => (
                <WorkoutLogCard
                  key={log._id}
                  log={log}
                  onDelete={handleDeleteLog}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Workouts Tab */}
      {activeTab === 'workouts' && (
        <>
          <h2 style={styles.subheading}>All Workout Logs</h2>
          {recentLogs.length === 0 ? (
            <div style={styles.empty}>
              <p>No workout logs found</p>
            </div>
          ) : (
            <div style={styles.logsGrid}>
              {recentLogs.map(log => (
                <WorkoutLogCard
                  key={log._id}
                  log={log}
                  onDelete={handleDeleteLog}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <>
          <h2 style={styles.subheading}>My Subscribed Plans</h2>
          {subscriptions.length === 0 ? (
            <div style={styles.empty}>
              <p>No subscriptions yet. Browse plans to get started!</p>
            </div>
          ) : (
            <div style={styles.subsGrid}>
              {subscriptions.map(sub => (
                <div key={sub._id} style={styles.subCard}>
                  <h3 style={styles.subTitle}>{sub.plan?.title}</h3>
                  <p style={styles.subTrainer}>By: {sub.plan?.trainer?.name}</p>
                  <div style={styles.subDetails}>
                    <p>Amount: ${sub.amount}</p>
                    <p>Start: {new Date(sub.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(sub.endDate).toLocaleDateString()}</p>
                  </div>
                  <span style={
                    new Date(sub.endDate) > new Date() 
                      ? styles.statusActive 
                      : styles.statusExpired
                  }>
                    {new Date(sub.endDate) > new Date() ? '✓ Active' : '✕ Expired'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <>
          <h2 style={styles.subheading}>Your Achievements</h2>
          {achievements.length === 0 ? (
            <div style={styles.empty}>
              <p>Keep working out to unlock achievements! 🏆</p>
            </div>
          ) : (
            <div style={styles.achievementsGrid}>
              {achievements.map(achievement => (
                <AchievementBadge key={achievement._id} achievement={achievement} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  heading: {
    fontSize: '2rem',
    margin: 0
  },
  logButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem'
  },
  noPlansMessage: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#78350f',
    fontWeight: '600'
  },
  logForm: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  formTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#1f2937'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  exercisesSection: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem'
  },
  exercisesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  exercisesTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0
  },
  addExerciseBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  noExercises: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.875rem',
    padding: '1rem'
  },
  exerciseRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  exerciseInput: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '0.875rem'
  },
  exerciseInputSmall: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '0.875rem'
  },
  removeBtn: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    padding: '0.5rem',
    fontSize: '1rem',
    width: '35px'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem'
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px'
  },
  activeTab: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#2563eb',
    borderBottom: '2px solid #2563eb',
    marginBottom: '-2px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  subheading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    marginTop: '2rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    color: '#6b7280'
  },
  logsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  subsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  subCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  subTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },
  subTrainer: {
    color: '#6b7280',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  },
  subDetails: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '1rem'
  },
  statusActive: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    display: 'inline-block'
  },
  statusExpired: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    display: 'inline-block'
  },
  achievementsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem'
  }
};
