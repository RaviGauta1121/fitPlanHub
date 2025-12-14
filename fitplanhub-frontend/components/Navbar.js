'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { notificationService } from '../lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationService.getNotifications();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          FitPlanHub ⚡
        </Link>

        <div style={styles.divider}></div>

        <div style={styles.links}>
          {user ? (
            <>
              <Link href="/plans" style={styles.link}>
                Plans
              </Link>

              {user.role === 'user' && (
                <>
                  <Link href="/trainers" style={styles.link}>
                    Trainers
                  </Link>
                  <Link href="/feed" style={styles.link}>
                    My Feed
                  </Link>
                  <Link href="/dashboard/user" style={styles.link}>
                    Dashboard
                  </Link>
                </>
              )}

              {user.role === 'trainer' && (
                <Link href="/dashboard/trainer" style={styles.link}>
                  Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" style={styles.link}>
                Login
              </Link>
            </>
          )}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.rightSection}>
          {user ? (
            <>
              <Link href="/notifications" style={styles.notificationBell}>
                🔔
                {unreadCount > 0 && (
                  <span style={styles.badge}>{unreadCount}</span>
                )}
              </Link>

              <span style={styles.username}>{user.name}</span>

              <button onClick={logout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/register" style={styles.button}>
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: 'auto',
    maxWidth: '95%'
  },
  container: {
    backgroundColor: 'rgba(37, 99, 235, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  logo: {
    color: 'white',
    fontSize: '1.15rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap'
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  links: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    opacity: 0.9
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  notificationBell: {
    position: 'relative',
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease'
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#dc2626',
    color: 'white',
    borderRadius: '50%',
    padding: '0.125rem 0.375rem',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    minWidth: '18px',
    textAlign: 'center'
  },
  username: {
    color: 'white',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontSize: '0.9rem',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#2563eb',
    padding: '0.5rem 1.25rem',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '0.9rem'
  }
};
