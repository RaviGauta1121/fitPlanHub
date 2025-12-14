'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationService.getNotifications();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Desktop Navigation
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
              <Link href="/plans" style={styles.link}>
                Plans
              </Link>

              {user.role === 'user' && (
                <>
                  <Link href="/trainers" style={styles.link}>
                    Trainers
                  </Link>
                  <Link href="/my-trainers" style={styles.link}>
                    My Trainers
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
                <>
                  <Link href="/dashboard/trainer" style={styles.link}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/trainer/audience" style={styles.link}>
                    My Audience
                  </Link>
                </>
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

  // Mobile Navigation
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
            onClick={toggleMenu} 
            style={styles.menuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div style={styles.hamburger}>
              <span style={{
                ...styles.hamburgerLine,
                transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></span>
              <span style={{
                ...styles.hamburgerLine,
                opacity: isMenuOpen ? 0 : 1
              }}></span>
              <span style={{
                ...styles.hamburgerLine,
                transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
              }}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div ref={menuRef} style={styles.mobileMenu}>
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

                  <Link 
                    href="/plans" 
                    style={styles.mobileMenuItem}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-menu-item"
                  >
                    📋 Plans
                  </Link>

                  {user.role === 'user' && (
                    <>
                      <Link 
                        href="/trainers" 
                        style={styles.mobileMenuItem}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item"
                      >
                        👨‍🏫 Trainers
                      </Link>
                      <Link 
                        href="/my-trainers" 
                        style={styles.mobileMenuItem}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item"
                      >
                        ⭐ My Trainers
                      </Link>
                      <Link 
                        href="/feed" 
                        style={styles.mobileMenuItem}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item"
                      >
                        📱 My Feed
                      </Link>
                      <Link 
                        href="/dashboard/user" 
                        style={styles.mobileMenuItem}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item"
                      >
                        📊 Dashboard
                      </Link>
                    </>
                  )}

                  {user.role === 'trainer' && (
                    <>
                      <Link 
                        href="/dashboard/trainer" 
                        style={styles.mobileMenuItem}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item"
                      >
                        📊 Dashboard
                      </Link>
                      <Link 
                        href="/dashboard/trainer/audience" 
                        style={styles.mobileMenuItem}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-item"
                      >
                        👥 My Audience
                      </Link>
                    </>
                  )}

                  <div style={styles.mobileDivider}></div>

                  <Link 
                    href="/notifications" 
                    style={styles.mobileMenuItem}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-menu-item"
                  >
                    🔔 Notifications
                    {unreadCount > 0 && (
                      <span style={styles.mobileMenuBadge}>{unreadCount}</span>
                    )}
                  </Link>

                  <div style={styles.mobileDivider}></div>

                  <button 
                    onClick={handleLogout} 
                    style={styles.mobileLogoutButton}
                    className="mobile-logout-button"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    style={styles.mobileMenuItem}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-menu-item"
                  >
                    🔑 Login
                  </Link>
                  
                  <div style={styles.mobileDivider}></div>
                  
                  <Link 
                    href="/register" 
                    style={styles.mobileSignUpButton}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-signup-button"
                  >
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

  return isMobile ? <MobileNav /> : <DesktopNav />;
}

const styles = {
  // Desktop Styles
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
    gap: '1rem',
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
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    cursor: 'pointer',
    fontSize: '0.85rem',
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
    fontSize: '0.85rem',
    maxWidth: '100px',
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
    fontSize: '0.85rem'
  },

  // Mobile Styles
  mobileNav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(37, 99, 235, 0.97)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
  },
  mobileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    maxWidth: '100%'
  },
  mobileLogo: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  mobileRightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  mobileNotificationBell: {
    position: 'relative',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.4rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  mobileBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: '#dc2626',
    color: 'white',
    borderRadius: '50%',
    padding: '0.15rem 0.4rem',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    minWidth: '18px',
    textAlign: 'center'
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    width: '26px',
    height: '26px',
    justifyContent: 'center'
  },
  hamburgerLine: {
    width: '26px',
    height: '3px',
    backgroundColor: 'white',
    borderRadius: '3px',
    transition: 'all 0.3s ease',
    transformOrigin: 'center'
  },
  mobileMenu: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: '16px',
    left: '16px',
    zIndex: 1001,
    animation: 'slideDown 0.3s ease-out'
  },
  mobileMenuContent: {
    backgroundColor: 'rgba(37, 99, 235, 0.98)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '1.25rem',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.35)',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto'
  },
  mobileUserInfo: {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  mobileUsername: {
    color: 'white',
    fontWeight: '700',
    fontSize: '1.1rem',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  },
  mobileUserRole: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    margin: '0.85rem 0'
  },
  mobileMenuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '0.85rem',
    color: 'white',
    textDecoration: 'none',
    padding: '0.9rem 1.1rem',
    borderRadius: '12px',
    margin: '0.35rem 0',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transition: 'all 0.2s ease',
    position: 'relative',
    fontSize: '1rem',
    fontWeight: '500',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  },
  mobileMenuBadge: {
    position: 'absolute',
    right: '1.1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    borderRadius: '12px',
    padding: '0.2rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
  },
  mobileLogoutButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: 'white',
    padding: '0.9rem 1.1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  },
  mobileSignUpButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#2563eb',
    padding: '1rem 1.5rem',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    marginTop: '0.5rem'
  }
};
