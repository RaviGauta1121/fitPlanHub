'use client';

import { useState, useEffect } from 'react';
import { notificationService } from '../../lib/auth';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../lib/theme';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Load notifications once user is ready
  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm('Delete this notification?')) return;

    try {
      await notificationService.deleteNotification(id);
      loadNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const iconFor = (type) => {
    return {
      new_follower: '👤',
      new_plan: '📋',
      subscription: '💳',
      achievement: '🏆',
      reminder: '⏰',
      review: '⭐'
    }[type] || '🔔';
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading notifications…</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Notifications</h1>
          {unreadCount > 0 && (
            <span style={styles.unreadBadge}>
              {unreadCount} unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={styles.markAllButton}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔕</div>
          <h2 style={styles.emptyTitle}>You're all caught up</h2>
          <p style={styles.emptyText}>
            New notifications will appear here
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map(notification => (
            <div
              key={notification._id}
              style={{
                ...styles.card,
                ...(notification.isRead ? styles.read : styles.unread)
              }}
              onClick={() => handleClick(notification)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = theme.shadows.sm;
              }}
            >
              <div style={styles.icon}>
                {iconFor(notification.type)}
              </div>

              <div style={styles.content}>
                <h3 style={styles.title}>
                  {notification.title}
                  {!notification.isRead && (
                    <span style={styles.newBadge}>NEW</span>
                  )}
                </h3>

                <p style={styles.message}>
                  {notification.message}
                </p>

                <span style={styles.time}>
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={styles.actions}>
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification._id);
                    }}
                    style={styles.readBtn}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  style={styles.deleteBtn}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   Styles
========================= */

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },

  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: theme.colors.textSecondary
  },

  spinner: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },

  heading: {
    fontSize: '2.2rem',
    fontWeight: '800',
    margin: 0,
    display: 'inline-block'
  },

  unreadBadge: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    padding: '0.3rem 0.9rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginLeft: '0.75rem'
  },

  markAllButton: {
    backgroundColor: theme.colors.gray800,
    color: 'white',
    padding: '0.6rem 1.4rem',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.2s',
    boxShadow: theme.shadows.sm
  },

  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: theme.colors.bgCard,
    borderRadius: '18px',
    border: `1px solid ${theme.colors.gray200}`
  },

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },

  emptyTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  },

  emptyText: {
    color: theme.colors.textSecondary
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },

  card: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: '14px',
    backgroundColor: theme.colors.bgCard,
    border: `1px solid ${theme.colors.gray200}`,
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    boxShadow: theme.shadows.sm
  },

  unread: {
    borderLeft: `4px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.primaryLighter
  },

  read: {
    opacity: 0.75
  },

  icon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: theme.colors.gray100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0
  },

  content: {
    flex: 1,
    minWidth: 0
  },

  title: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  newBadge: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    fontSize: '0.6rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '50px',
    fontWeight: '800'
  },

  message: {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginBottom: '0.4rem',
    lineHeight: '1.5'
  },

  time: {
    fontSize: '0.75rem',
    color: theme.colors.textLight
  },

  actions: {
    display: 'flex',
    gap: '0.5rem'
  },

  readBtn: {
    backgroundColor: theme.colors.success,
    color: 'white',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontWeight: '700'
  },

  deleteBtn: {
    backgroundColor: theme.colors.error,
    color: 'white',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontWeight: '700'
  }
};
