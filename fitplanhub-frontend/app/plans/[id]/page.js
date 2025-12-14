'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { planService, subscriptionService, reviewService } from '../../../lib/auth';
import { useAuth } from '../../../context/AuthContext';
import ReviewCard from '../../../components/ReviewCard';

export default function PlanDetails() {
  const [plan, setPlan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlan();
    fetchReviews();
  }, [params.id]);

  const fetchPlan = async () => {
    try {
      const response = await planService.getPlanById(params.id);
      setPlan(response.data);
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getPlanReviews(params.id);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscriptionService.subscribe(params.id);
      alert('Subscription successful!');
      fetchPlan();
    } catch (error) {
      alert(error.response?.data?.message || 'Subscription failed');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.createReview({
        planId: params.id,
        ...reviewData
      });
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      fetchReviews();
      fetchPlan();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (confirm('Delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        fetchReviews();
        fetchPlan();
      } catch (error) {
        alert('Failed to delete review');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!plan) return <div style={styles.error}>Plan not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{plan.title}</h1>
          {plan.preview && (
            <span style={styles.badge}>Preview Only</span>
          )}
        </div>

        {plan.averageRating > 0 && (
          <div style={styles.ratingSection}>
            <span style={styles.stars}>{'⭐'.repeat(Math.round(plan.averageRating))}</span>
            <span style={styles.ratingText}>
              {plan.averageRating.toFixed(1)} ({plan.reviewCount} reviews)
            </span>
          </div>
        )}

        <div style={styles.trainerInfo}>
          <p style={styles.label}>Trainer</p>
          <p style={styles.trainerName} onClick={() => router.push(`/trainers/${plan.trainer._id}`)}>
            {plan.trainer?.name}
          </p>
          {plan.trainer?.certifications && (
            <p style={styles.certifications}>{plan.trainer.certifications}</p>
          )}
        </div>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.label}>Price</span>
            <span style={styles.price}>${plan.price}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>Duration</span>
            <span style={styles.value}>{plan.duration} days</span>
          </div>
          {plan.category && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Category</span>
              <span style={styles.value}>{plan.category}</span>
            </div>
          )}
          {plan.difficulty && (
            <div style={styles.detailItem}>
              <span style={styles.label}>Level</span>
              <span style={styles.value}>{plan.difficulty}</span>
            </div>
          )}
        </div>

        {!plan.preview ? (
          <>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Description</h2>
              <p style={styles.description}>{plan.description}</p>
            </div>

            {plan.exercises && plan.exercises.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Exercises</h2>
                <div style={styles.exerciseList}>
                  {plan.exercises.map((exercise, index) => (
                    <div key={index} style={styles.exercise}>
                      <h3 style={styles.exerciseName}>{exercise.name}</h3>
                      {exercise.sets && exercise.reps && (
                        <p style={styles.exerciseDetails}>
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      )}
                      {exercise.description && (
                        <p style={styles.exerciseDescription}>{exercise.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Section */}
            <div style={styles.section}>
              <div style={styles.reviewHeader}>
                <h2 style={styles.sectionTitle}>Reviews</h2>
                {user?.role === 'user' && !showReviewForm && (
                  <button onClick={() => setShowReviewForm(true)} style={styles.reviewBtn}>
                    Write a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
                  <select
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({...reviewData, rating: Number(e.target.value)})}
                    style={styles.ratingSelect}
                    required
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Below Average</option>
                    <option value="1">⭐ Poor</option>
                  </select>
                  <textarea
                    placeholder="Share your experience..."
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    style={styles.reviewTextarea}
                    required
                    maxLength={500}
                  />
                  <div style={styles.reviewFormActions}>
                    <button type="submit" style={styles.submitReviewBtn}>Submit Review</button>
                    <button 
                      type="button" 
                      onClick={() => setShowReviewForm(false)} 
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div style={styles.reviewsList}>
                {reviews.length === 0 ? (
                  <p style={styles.noReviews}>No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(review => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      canDelete={user?.id === review.user?._id}
                      onDelete={handleDeleteReview}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={styles.previewMessage}>
            <p>Subscribe to this plan to view:</p>
            <ul style={styles.previewList}>
              <li>Full description and workout details</li>
              <li>Complete exercise list with instructions</li>
              <li>Progress tracking capabilities</li>
              <li>Ability to leave reviews</li>
            </ul>
          </div>
        )}

        {plan.preview && user?.role === 'user' && (
          <button onClick={handleSubscribe} style={styles.subscribeButton}>
            Subscribe for ${plan.price}
          </button>
        )}

        {!plan.preview && (
          <div style={styles.subscribed}>
            <p>✓ You have access to this plan</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#dc2626'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  badge: {
    backgroundColor: '#fbbf24',
    color: '#78350f',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  stars: {
    fontSize: '1.25rem'
  },
  ratingText: {
    fontSize: '1rem',
    color: '#6b7280',
    fontWeight: '600'
  },
  trainerInfo: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem'
  },
  label: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem'
  },
  trainerName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2563eb',
    cursor: 'pointer',
    margin: '0.25rem 0'
  },
  certifications: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginTop: '0.25rem'
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: '0.5rem'
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginTop: '0.5rem',
    textTransform: 'capitalize'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.75',
    color: '#4b5563'
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  exercise: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.5rem',
    borderLeft: '4px solid #2563eb'
  },
  exerciseName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  exerciseDetails: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '600',
    margin: '0.25rem 0'
  },
  exerciseDescription: {
    fontSize: '0.875rem',
    color: '#4b5563',
    margin: '0.5rem 0 0 0'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  reviewBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  reviewForm: {
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem'
  },
  ratingSelect: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '1rem'
  },
  reviewTextarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  reviewFormActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  submitReviewBtn: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontWeight: '600'
  },
  cancelBtn: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontWeight: '600'
  },
  reviewsList: {
    marginTop: '1.5rem'
  },
  noReviews: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '2rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem'
  },
  previewMessage: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  previewList: {
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    color: '#78350f'
  },
  subscribeButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '1rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  subscribed: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    fontWeight: '600'
  }
};
