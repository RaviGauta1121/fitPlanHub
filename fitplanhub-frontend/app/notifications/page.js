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

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this notification?')) {
      try {
        await notificationService.deleteNotification(id);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      new_follower: '👤',
      new_plan: '📋',
      subscription: '💳',
      achievement: '🏆',
      reminder: '⏰',
      review: '⭐'
    };
    return icons[type] || '🔔';
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Notifications</h1>
          {unreadCount > 0 && (
            <span style={styles.unreadBadge}>{unreadCount} unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} style={styles.markAllButton}>
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔕</div>
          <h2 style={styles.emptyTitle}>No notifications yet</h2>
          <p style={styles.emptyText}>
            When you get notifications, they'll show up here
          </p>
        </div>
      ) : (
        <div style={styles.notificationsList}>
          {notifications.map(notification => (
            <div
              key={notification._id}
              style={{
                ...styles.notificationCard,
                ...(notification.isRead ? styles.readCard : styles.unreadCard)
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <div style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </div>
              
              <div style={styles.notificationContent}>
                <h3 style={styles.notificationTitle}>
                  {notification.title}
                  {!notification.isRead && (
                    <span style={styles.newBadge}>NEW</span>
                  )}
                </h3>
                <p style={styles.notificationMessage}>
                  {notification.message}
                </p>
                <span style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={styles.notificationActions}>
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification._id);
                    }}
                    style={styles.readButton}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification._id);
                  }}
                  style={styles.deleteButton}
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

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: theme.colors.textSecondary
  },
  spinner: {
    fontSize: '3rem',
    marginBottom: '1rem',
    animation: 'spin 2s linear infinite'
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
    fontSize: '2rem',
    margin: '0',
    color: theme.colors.gray900,
    display: 'inline-block',
    marginRight: '1rem'
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginLeft: '0.5rem'
  },
  markAllButton: {
    backgroundColor: theme.colors.gray700,
    color: theme.colors.white,
    padding: '0.625rem 1.25rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    boxShadow: theme.shadows.sm
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: theme.colors.bgCard,
    borderRadius: '0.75rem',
    boxShadow: theme.shadows.sm
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: theme.colors.gray900,
    marginBottom: '0.5rem'
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: '1rem'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  notificationCard: {
    backgroundColor: theme.colors.bgCard,
    padding: '1.25rem',
    borderRadius: '0.75rem',
    boxShadow: theme.shadows.sm,
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: `1px solid ${theme.colors.gray200}`
  },
  unreadCard: {
    borderLeft: `4px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.primaryLighter
  },
  readCard: {
    opacity: 0.7
  },
  notificationIcon: {
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
  notificationContent: {
    flex: 1,
    minWidth: 0
  },
  notificationTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: theme.colors.gray900,
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  newBadge: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: '0.125rem 0.5rem',
    borderRadius: '50px',
    fontSize: '0.625rem',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  notificationMessage: {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginBottom: '0.5rem',
    lineHeight: '1.5'
  },
  notificationTime: {
    fontSize: '0.75rem',
    color: theme.colors.textLight
  },
  notificationActions: {
    display: 'flex',
    gap: '0.5rem',
    flexShrink: 0
  },
  readButton: {
    backgroundColor: theme.colors.success,
    color: theme.colors.white,
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    transition: 'all 0.2s',
    fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    color: theme.colors.white,
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    transition: 'all 0.2s',
    fontWeight: 'bold'
  }
};
