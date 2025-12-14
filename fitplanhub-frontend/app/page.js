"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { theme } from "../lib/theme";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heading}>Transform Your Fitness Journey</h1>
        <p style={styles.subheading}>
          Connect with certified trainers and unlock personalized fitness plans
          designed for your goals
        </p>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>💪</div>
          <h3 style={styles.featureTitle}>For Users</h3>
          <p style={styles.featureText}>
            Browse expert-crafted plans, track progress, and achieve your
            fitness goals
          </p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🎯</div>
          <h3 style={styles.featureTitle}>For Trainers</h3>
          <p style={styles.featureText}>
            Create plans, grow your audience, and monetize your expertise
          </p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>📊</div>
          <h3 style={styles.featureTitle}>Track Progress</h3>
          <p style={styles.featureText}>
            Log workouts, earn achievements, and visualize your improvement
          </p>
        </div>
      </div>

      {!user && (
        <div style={styles.actions}>
          <Link href="/register" style={styles.primaryButton}>
            Get Started Free
          </Link>
          <Link href="/login" style={styles.secondaryButton}>
            Sign In
          </Link>
        </div>
      )}

      {user && (
        <div style={styles.actions}>
          <Link href="/plans" style={styles.primaryButton}>
            Browse Plans
          </Link>
          {user.role === "user" && (
            <Link href="/dashboard/user" style={styles.secondaryButton}>
              My Dashboard
            </Link>
          )}
          {user.role === "trainer" && (
            <Link href="/dashboard/trainer" style={styles.secondaryButton}>
              Trainer Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "0 1rem",
  },
  hero: {
    marginBottom: "4rem",
  },
  heading: {
    fontSize: "3.5rem",
    marginBottom: "1rem",
    color: theme.colors.gray900,
    fontWeight: "800",
    lineHeight: "1.2",
  },
  subheading: {
    fontSize: "1.25rem",
    color: theme.colors.textSecondary,
    marginBottom: "3rem",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  feature: {
    padding: "2rem",
    backgroundColor: theme.colors.bgCard,
    borderRadius: "0.75rem",
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.gray200}`,
    transition: "all 0.3s",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: theme.colors.gray900,
    marginBottom: "0.75rem",
  },
  featureText: {
    color: theme.colors.textSecondary,
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "3rem",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: "1rem 2.5rem",
    borderRadius: "0.75rem",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.125rem",
    transition: "all 0.2s",
    boxShadow: theme.shadows.md,
  },
  secondaryButton: {
    backgroundColor: theme.colors.gray800,
    color: theme.colors.white,
    padding: "1rem 2.5rem",
    borderRadius: "0.75rem",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.125rem",
    transition: "all 0.2s",
  },
};
