import { theme } from '../lib/theme';

export default function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div style={styles.card}>
      <div style={styles.iconContainer}>
        <span style={styles.icon}>{icon}</span>
      </div>
      <div style={styles.content}>
        <h3 style={styles.value}>{value}</h3>
        <p style={styles.title}>{title}</p>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.bgCard,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: theme.shadows.md,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: `1px solid ${theme.colors.gray200}`,
    transition: 'all 0.2s'
  },
  iconContainer: {
    backgroundColor: theme.colors.primaryLighter,
    borderRadius: '0.75rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: '2rem'
  },
  content: {
    flex: 1
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.colors.gray900,
    margin: '0 0 0.25rem 0'
  },
  title: {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    margin: '0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  subtitle: {
    fontSize: '0.75rem',
    color: theme.colors.textLight,
    margin: '0.25rem 0 0 0'
  }
};
