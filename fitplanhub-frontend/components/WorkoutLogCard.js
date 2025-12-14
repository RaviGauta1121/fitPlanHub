export default function WorkoutLogCard({ log, onDelete }) {
  const getMoodEmoji = (mood) => {
    const moods = {
      excellent: '😄',
      good: '😊',
      average: '😐',
      tired: '😓',
      exhausted: '😫'
    };
    return moods[mood] || '😐';
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.planTitle}>{log.plan?.title}</h3>
        <span style={styles.mood}>{getMoodEmoji(log.mood)}</span>
      </div>
      
      <div style={styles.stats}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Duration</span>
          <span style={styles.statValue}>{log.duration} min</span>
        </div>
        {log.caloriesBurned && (
          <div style={styles.stat}>
            <span style={styles.statLabel}>Calories</span>
            <span style={styles.statValue}>{log.caloriesBurned} kcal</span>
          </div>
        )}
      </div>

      {log.exercises && log.exercises.length > 0 && (
        <div style={styles.exercises}>
          <p style={styles.exercisesTitle}>Exercises:</p>
          {log.exercises.map((ex, index) => (
            <div key={index} style={styles.exercise}>
              {ex.exerciseName} - {ex.setsCompleted}×{ex.repsCompleted}
              {ex.weight && ` @ ${ex.weight}kg`}
            </div>
          ))}
        </div>
      )}

      {log.notes && <p style={styles.notes}>📝 {log.notes}</p>}

      <div style={styles.footer}>
        <span style={styles.date}>
          {new Date(log.date).toLocaleDateString()}
        </span>
        <button onClick={() => onDelete(log._id)} style={styles.deleteBtn}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  planTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  mood: {
    fontSize: '1.5rem'
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  exercises: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.25rem',
    marginBottom: '1rem'
  },
  exercisesTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4b5563',
    margin: '0 0 0.5rem 0'
  },
  exercise: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.25rem'
  },
  notes: {
    fontSize: '0.875rem',
    color: '#4b5563',
    fontStyle: 'italic',
    marginBottom: '1rem'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600'
  }
};
