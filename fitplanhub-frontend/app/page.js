"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { theme } from "../lib/theme";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.badgeText}>TRUSTED BY 10K+ FITNESS ENTHUSIASTS</span>
          </div>
          
          <h1 style={styles.heading}>
            Elevate Your
            <span style={styles.gradientText}> Fitness Potential</span>
          </h1>
          
          <p style={styles.subheading}>
            Connect with certified trainers and access personalized fitness plans 
            engineered to deliver measurable results
          </p>
          
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Certified Trainers</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>10K+</div>
              <div style={styles.statLabel}>Active Users</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>95%</div>
              <div style={styles.statLabel}>Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section style={styles.valueSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Choose FitnessHub</h2>
          <p style={styles.sectionDescription}>
            A comprehensive platform built for fitness success
          </p>
        </div>

        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.iconBackground}></div>
              <div style={styles.featureIcon}>💪</div>
            </div>
            <h3 style={styles.featureTitle}>Personalized Training</h3>
            <p style={styles.featureText}>
              AI-powered fitness plans tailored to your goals, body type, and schedule
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.iconBackground}></div>
              <div style={styles.featureIcon}>🎯</div>
            </div>
            <h3 style={styles.featureTitle}>Expert Guidance</h3>
            <p style={styles.featureText}>
              Connect with certified trainers for 1-on-1 coaching and real-time feedback
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.iconBackground}></div>
              <div style={styles.featureIcon}>📊</div>
            </div>
            <h3 style={styles.featureTitle}>Progress Analytics</h3>
            <p style={styles.featureText}>
              Track performance, visualize results, and optimize your fitness journey
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.iconBackground}></div>
              <div style={styles.featureIcon}>🤝</div>
            </div>
            <h3 style={styles.featureTitle}>Community Support</h3>
            <p style={styles.featureText}>
              Join a network of fitness enthusiasts and stay motivated together
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>
              Ready to Transform Your Fitness Journey?
            </h2>
            <p style={styles.ctaDescription}>
              Join thousands who've achieved their fitness goals with personalized guidance
            </p>
            
            <div style={styles.buttonGroup}>
              {!user ? (
                <>
                  <Link href="/register" style={styles.primaryButton}>
                    <span style={styles.buttonText}>Start Free Trial</span>
                    <span style={styles.buttonSubtext}>No credit card required</span>
                  </Link>
                  <Link href="/login" style={styles.secondaryButton}>
                    Sign In to Account
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/plans" style={styles.primaryButton}>
                    <span style={styles.buttonText}>Explore Premium Plans</span>
                    <span style={styles.buttonSubtext}>Unlock all features</span>
                  </Link>
                  {user.role === "user" ? (
                    <Link href="/dashboard/user" style={styles.secondaryButton}>
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link href="/dashboard/trainer" style={styles.secondaryButton}>
                      Trainer Portal
                    </Link>
                  )}
                </>
              )}
            </div>
            
            <div style={styles.trustBadges}>
              <div style={styles.trustItem}>🔒 Secure Platform</div>
              <div style={styles.trustItem}>⭐ 4.9/5 Rating</div>
              <div style={styles.trustItem}>💬 24/7 Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  },
  
  // Hero Section
  heroSection: {
    padding: "6rem 1rem 4rem",
    position: "relative",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "10",
    padding: "0.5rem 1rem",
    borderRadius: "2rem",
    marginBottom: "2rem",
    border: `1px solid ${theme.colors.primary}20`,
  },
  
  badgeText: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: theme.colors.primary,
    letterSpacing: "0.05em",
  },
  
  heading: {
    fontSize: "3.75rem",
    fontWeight: "800",
    color: theme.colors.gray900,
    lineHeight: "1.1",
    marginBottom: "1.5rem",
    letterSpacing: "-0.02em",
  },
  
  gradientText: {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary || "#667eea"})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "block",
  },
  
  subheading: {
    fontSize: "1.25rem",
    color: theme.colors.textSecondary,
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto 3rem",
  },
  
  heroStats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3rem",
    marginTop: "4rem",
  },
  
  statItem: {
    textAlign: "center",
  },
  
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: theme.colors.gray900,
    lineHeight: "1",
  },
  
  statLabel: {
    fontSize: "0.875rem",
    color: theme.colors.gray600,
    fontWeight: "500",
    marginTop: "0.5rem",
    letterSpacing: "0.05em",
  },
  
  statDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: theme.colors.gray300,
  },
  
  // Value Section
  valueSection: {
    padding: "6rem 1rem",
    backgroundColor: "#ffffff",
    borderTop: `1px solid ${theme.colors.gray200}`,
    borderBottom: `1px solid ${theme.colors.gray200}`,
  },
  
  sectionHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 4rem",
  },
  
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: theme.colors.gray900,
    marginBottom: "1rem",
  },
  
  sectionDescription: {
    fontSize: "1.125rem",
    color: theme.colors.gray600,
    lineHeight: "1.6",
  },
  
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  
  featureCard: {
    padding: "2.5rem 2rem",
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    border: `1px solid ${theme.colors.gray200}`,
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
  },
  
  featureIconWrapper: {
    position: "relative",
    width: "64px",
    height: "64px",
    margin: "0 auto 1.5rem",
  },
  
  iconBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.primary}05)`,
    borderRadius: "16px",
    transform: "rotate(45deg)",
  },
  
  featureIcon: {
    position: "relative",
    fontSize: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: theme.colors.gray900,
    marginBottom: "1rem",
    textAlign: "center",
  },
  
  featureText: {
    fontSize: "0.95rem",
    color: theme.colors.gray600,
    lineHeight: "1.6",
    textAlign: "center",
  },
  
  // CTA Section
  ctaSection: {
    padding: "6rem 1rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  
  ctaCard: {
    background: `linear-gradient(135deg, ${theme.colors.gray900}, ${theme.colors.gray800})`,
    borderRadius: "1.5rem",
    padding: "4rem",
    position: "relative",
    overflow: "hidden",
  },
  
  ctaContent: {
    position: "relative",
    zIndex: "1",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
  },
  
  ctaTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "1rem",
    lineHeight: "1.2",
  },
  
  ctaDescription: {
    fontSize: "1.125rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "2.5rem",
    lineHeight: "1.6",
  },
  
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginBottom: "3rem",
    flexWrap: "wrap",
  },
  
  primaryButton: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    color: "#ffffff",
    padding: "1.25rem 2.5rem",
    borderRadius: "0.75rem",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1.125rem",
    transition: "all 0.2s ease",
    minWidth: "220px",
    border: "none",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  
  buttonText: {
    fontSize: "1.125rem",
    fontWeight: "600",
  },
  
  buttonSubtext: {
    fontSize: "0.75rem",
    opacity: "0.9",
    fontWeight: "400",
    marginTop: "0.25rem",
  },
  
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    color: "#ffffff",
    padding: "1.25rem 2.5rem",
    borderRadius: "0.75rem",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1.125rem",
    transition: "all 0.2s ease",
    minWidth: "220px",
    border: `2px solid rgba(255, 255, 255, 0.2)`,
    cursor: "pointer",
  },
  
  trustBadges: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
};