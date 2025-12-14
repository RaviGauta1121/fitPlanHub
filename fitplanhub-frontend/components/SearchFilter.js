'use client';

import { useState } from 'react';
import { theme } from '../lib/theme';

// Simple search + filter bar for plans.
// Kept local state here to avoid spamming parent on every keystroke.
export default function SearchFilter({ onSearch }) {

  // Default filters live here so reset + init stay in sync
  const defaultFilters = {
    keyword: '',
    category: '',
    difficulty: '',
    minRating: '',
    sort: 'latest'
  };

  const [filters, setFilters] = useState(defaultFilters);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  // Reset everything back to defaults
  const handleReset = () => {
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  // Generic helper so we don't repeat setFilters everywhere
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Search plans..."
          value={filters.keyword}
          onChange={(e) => updateFilter('keyword', e.target.value)}
          style={styles.input}
        />

        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          <option value="strength">Strength Training</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibility</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="endurance">Endurance</option>
          <option value="general">General Fitness</option>
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => updateFilter('difficulty', e.target.value)}
          style={styles.select}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={filters.minRating}
          onChange={(e) => updateFilter('minRating', e.target.value)}
          style={styles.select}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          style={styles.select}
        >
          <option value="latest">Latest</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>

        <button type="submit" style={styles.button}>
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          style={styles.resetButton}
        >
          Reset
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: theme.colors.bgCard,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.gray200}`
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    alignItems: 'center'
  },
  input: {
    padding: '0.75rem',
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: theme.colors.white,
    color: theme.colors.textPrimary,
    transition: 'all 0.2s'
  },
  select: {
    padding: '0.75rem',
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: theme.colors.white,
    color: theme.colors.textPrimary,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  button: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    boxShadow: theme.shadows.sm
  },
  resetButton: {
    backgroundColor: theme.colors.gray700,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.2s'
  }
};
