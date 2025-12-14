'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../lib/auth';

// Navbar ended up a bit big, but I prefer keeping desktop + mobile logic together
export default function Navbar() {
  const { user, logout } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const dropdownRef = useRef(null);

  // Detect screen size manually instead of relying only on CSS
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch notifications whenever user changes
  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setUnreadCount(res?.data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleLogoutClick = () => {
    logout();
    setMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  /* =========================
     Desktop Navigation
     ========================= */
  const DesktopNav = () => (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          FitPlanHub ⚡
        </Link>

        <div style={styles.divider}></div>

        <div style={styles.links}>
          {user ? (
            <>
              <Link href="/plans" style={styles.link}>Plans</Link>

              {user.role === 'user' && (
                <>
                  <Link href="/trainers" style={styles.link}>Trainers</Link>
                  <Link href="/my-trainers" style={styles.link}>My Trainers</Link>
                  <Link href="/feed" style={styles.link}>My Feed</Link>
                  <Link href="/dashboard/user" style={styles.link}>Dashboard</Link>
                </>
              )}

              {user.role === 'trainer' && (
                <>
                  <Link href="/dashboard/trainer" style={styles.link}>Dashboard</Link>
                  <Link href="/dashboard/trainer/audience" style={styles.link}>My Audience</Link>
                </>
              )}
            </>
          ) : (
            <Link href="/login" style={styles.link}>Login</Link>
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

  /* =========================
     Mobile Navigation
     ========================= */
  const MobileNav = () => (
    <nav style={styles.mobileNav}>
      <div style={styles.mobileContainer}>
        <Link href="/" style={styles.mobileLogo}>
          FitPlanHub ⚡
        </Link>

        <div style={styles.mobileRightSection}>
          {user && (
            <Link href="/notifications" style={styles.mobileNotificationBell}>
              🔔
              {unreadCount > 0 && (
                <span style={styles.mobileBadge}>{unreadCount}</span>
              )}
            </Link>
          )}

          <button
            onClick={toggleMobileMenu}
            style={styles.menuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <div style={styles.hamburger}>
              <span
                style={{
                  ...styles.hamburgerLine,
                  transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }}
              ></span>
              <span
                style={{
                  ...styles.hamburgerLine,
                  opacity: menuOpen ? 0 : 1
                }}
              ></span>
              <span
                style={{
                  ...styles.hamburgerLine,
                  transform: menuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
                }}
              ></span>
            </div>
          </button>
        </div>

        {menuOpen && (
          <div ref={dropdownRef} style={styles.mobileMenu}>
            <div style={styles.mobileMenuContent}>
              {user ? (
                <>
                  <div style={styles.mobileUserInfo}>
                    <span style={styles.mobileUsername}>{user.name}</span>
                    <span style={styles.mobileUserRole}>
                      {user.role === 'trainer' ? '👨‍🏫 Trainer' : '👤 User'}
                    </span>
                  </div>

                  <div style={styles.mobileDivider}></div>

                  <Link href="/plans" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                    📋 Plans
                  </Link>

                  {user.role === 'user' && (
                    <>
                      <Link href="/trainers" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                        👨‍🏫 Trainers
                      </Link>
                      <Link href="/my-trainers" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                        ⭐ My Trainers
                      </Link>
                      <Link href="/feed" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                        📱 My Feed
                      </Link>
                      <Link href="/dashboard/user" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                        📊 Dashboard
                      </Link>
                    </>
                  )}

                  {user.role === 'trainer' && (
                    <>
                      <Link href="/dashboard/trainer" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                        📊 Dashboard
                      </Link>
                      <Link href="/dashboard/trainer/audience" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                        👥 My Audience
                      </Link>
                    </>
                  )}

                  <div style={styles.mobileDivider}></div>

                  <Link href="/notifications" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                    🔔 Notifications
                    {unreadCount > 0 && (
                      <span style={styles.mobileMenuBadge}>{unreadCount}</span>
                    )}
                  </Link>

                  <div style={styles.mobileDivider}></div>

                  <button onClick={handleLogoutClick} style={styles.mobileLogoutButton}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                    🔑 Login
                  </Link>

                  <div style={styles.mobileDivider}></div>

                  <Link href="/register" style={styles.mobileSignUpButton} onClick={() => setMenuOpen(false)}>
                    ✨ Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  return isMobileView ? <MobileNav /> : <DesktopNav />;
}

const styles = {
  nav: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: 'fit-content',
    maxWidth: '100%',
  },

  container: {
    backgroundColor: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2.2rem',
    borderRadius: '50px',
    gap: '2rem',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    boxShadow: '0 6px 25px rgba(0,0,0,0.18)',
  },

  logo: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '700',
    textDecoration: 'none',
  },

  divider: {
    width: '1px',
    height: '26px',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.8rem',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
  },

  link: {
    color: 'white',
    fontSize: '0.95rem',
    textDecoration: 'none',
    fontWeight: '500',
    opacity: 0.92,
    padding: '0.25rem 0.15rem',
    transition: '0.2s ease',
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    whiteSpace: 'nowrap',
  },

  notificationBell: {
    position: 'relative',
    fontSize: '1.25rem',
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
  },

  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '2px 6px',
    fontSize: '0.65rem',
    borderRadius: '50%',
    fontWeight: '700',
  },

  username: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500',
    maxWidth: '150px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

  button: {
    backgroundColor: 'white',
    color: '#2563eb',
    padding: '0.55rem 1.4rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.2s',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
  },

  /* MOBILE BELOW */
  mobileNav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#2563eb',
    zIndex: 1000,
  },

  mobileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mobileLogo: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '700',
    textDecoration: 'none',
  },

  mobileRightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  mobileNotificationBell: {
    position: 'relative',
    fontSize: '1.4rem',
    color: 'white',
    textDecoration: 'none',
  },

  mobileBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '2px 5px',
    fontSize: '0.7rem',
    borderRadius: '50%',
  },

  menuToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },

  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  hamburgerLine: {
    width: '26px',
    height: '3px',
    backgroundColor: 'white',
    borderRadius: '2px',
    transition: '0.3s',
  },

  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: '16px',
    right: '16px',
    marginTop: '12px',
  },

  mobileMenuContent: {
    backgroundColor: '#2563eb',
    padding: '1.2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  },

  mobileUserInfo: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '1rem',
    borderRadius: '12px',
  },

  mobileUsername: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
  },

  mobileUserRole: {
    color: 'white',
    opacity: 0.9,
  },

  mobileDivider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.25)',
    margin: '1rem 0',
  },

  mobileMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.8rem',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    textDecoration: 'none',
    marginBottom: '0.5rem',
    fontSize: '1rem',
  },

  mobileMenuBadge: {
    marginLeft: 'auto',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '0.75rem',
  },

  mobileLogoutButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '0.85rem',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  },

  mobileSignUpButton: {
    width: '100%',
    backgroundColor: 'white',
    color: '#2563eb',
    padding: '1rem',
    borderRadius: '14px',
    fontWeight: '700',
    textDecoration: 'none',
    textAlign: 'center',
  }
};




