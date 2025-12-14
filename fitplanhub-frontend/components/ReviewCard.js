export default function ReviewCard({ review, onDelete, canDelete }) {
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.name}>{review.user?.name}</span>
          {review.isVerifiedPurchase && (
            <span style={styles.verified}>✓ Verified Purchase</span>
          )}
        </div>
        <div style={styles.rating}>{renderStars(review.rating)}</div>
      </div>
      
      <p style={styles.comment}>{review.comment}</p>
      
      <div style={styles.footer}>
        <span style={styles.date}>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
        {canDelete && (
          <button onClick={() => onDelete(review._id)} style={styles.deleteBtn}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #e5e7eb'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  name: {
    fontWeight: '600',
    color: '#1f2937'
  },
  verified: {
    fontSize: '0.75rem',
    color: '#10b981',
    marginLeft: '0.5rem',
    fontWeight: '600'
  },
  rating: {
    fontSize: '1.25rem'
  },
  comment: {
    color: '#4b5563',
    lineHeight: '1.5',
    marginBottom: '0.75rem'
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
    padding: '0.25rem 0.75rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.75rem'
  }
};
