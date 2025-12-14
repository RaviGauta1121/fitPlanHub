export default function TrainerCard({ trainer, isFollowing, onFollow, onUnfollow }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.name}>{trainer.name}</h3>
      <p style={styles.email}>{trainer.email}</p>
      {trainer.certifications && (
        <p style={styles.cert}>Certifications: {trainer.certifications}</p>
      )}
      
      <button 
        onClick={isFollowing ? onUnfollow : onFollow}
        style={isFollowing ? styles.unfollowButton : styles.followButton}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    backgroundColor: 'white'
  },
  name: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  email: {
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  cert: {
    color: '#374151',
    marginBottom: '1rem'
  },
  followButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  },
  unfollowButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  }
};
