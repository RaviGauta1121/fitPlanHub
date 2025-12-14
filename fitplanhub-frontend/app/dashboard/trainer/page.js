"use client";

import { useEffect, useState } from "react";
import { planService } from "../../../lib/auth";
import { useAuth } from "../../../context/AuthContext";
import StatsCard from "../../../components/StatsCard";

// Trainer-only dashboard for managing plans
export default function TrainerDashboard() {
  const { user } = useAuth();

  // Core state
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form state (a bit chunky, but manageable for now)
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "general",
    difficulty: "beginner",
    tags: "",
    exercises: [],
  });

  // Load plans once trainer is confirmed
  useEffect(() => {
    if (user?.role === "trainer") {
      loadPlans();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      const res = await planService.getTrainerPlans();
      setPlans(res.data || []);
    } catch (err) {
      console.error("Failed to fetch trainer plans:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated tags into array
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await planService.updatePlan(editing._id, payload);
        alert("Plan updated successfully!");
      } else {
        await planService.createPlan(payload);
        alert("Plan created successfully!");
      }

      resetForm();
      loadPlans();
    } catch (err) {
      console.error("Save plan error:", err);
      alert("Error saving plan");
    }
  };

  const handleEdit = (plan) => {
    setEditing(plan);
    setForm({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      category: plan.category || "general",
      difficulty: plan.difficulty || "beginner",
      tags: plan.tags?.join(", ") || "",
      exercises: plan.exercises || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      await planService.deletePlan(planId);
      loadPlans();
    } catch (err) {
      alert("Error deleting plan");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      duration: "",
      category: "general",
      difficulty: "beginner",
      tags: "",
      exercises: [],
    });
    setEditing(null);
    setShowForm(false);
  };

  // Exercise helpers (not super elegant, but clear)
  const addExercise = () => {
    setForm((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", sets: "", reps: "", description: "" },
      ],
    }));
  };

  const updateExercise = (idx, key, value) => {
    const copy = [...form.exercises];
    copy[idx][key] = value;
    setForm({ ...form, exercises: copy });
  };

  const removeExercise = (idx) => {
    setForm({
      ...form,
      exercises: form.exercises.filter((_, i) => i !== idx),
    });
  };

  // Safety check
  if (user?.role !== "trainer") {
    return <div>Access denied</div>;
  }

  // Dashboard stats (kept inline for readability)
  const totalPlans = plans.length;
  const totalSubscribers = plans.reduce(
    (sum, p) => sum + (p.subscriberCount || 0),
    0
  );
  const averageRating =
    plans.length > 0
      ? (
          plans.reduce((sum, p) => sum + (p.averageRating || 0), 0) /
          plans.length
        ).toFixed(1)
      : 0;
  const totalRevenue = plans.reduce(
    (sum, p) => sum + (p.subscriberCount || 0) * p.price,
    0
  );

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Trainer Dashboard</h1>
        <button style={styles.button} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create New Plan"}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <StatsCard title="Total Plans" value={totalPlans} icon="📋" />
        <StatsCard
          title="Total Subscribers"
          value={totalSubscribers}
          icon="👥"
        />
        <StatsCard
          title="Average Rating"
          value={averageRating}
          icon="⭐"
          subtitle="Out of 5.0"
        />
        <StatsCard
          title="Estimated Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="💰"
        />
      </div>

      {showForm && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>
            {editing ? "Edit Plan" : "Create New Plan"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Plan Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={styles.input}
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={styles.textarea}
              required
            />

            <div style={styles.formRow}>
              <input
                type="number"
                placeholder="Price ($)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Duration (days)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formRow}>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={styles.input}
              >
                <option value="general">General Fitness</option>
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
              </select>

              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
                style={styles.input}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              style={styles.input}
            />

            {/* Exercises */}
            <div style={styles.exercisesSection}>
              <div style={styles.exercisesHeader}>
                <h3 style={styles.exercisesTitle}>Exercises</h3>
                <button
                  type="button"
                  onClick={addExercise}
                  style={styles.addExerciseBtn}
                >
                  + Add Exercise
                </button>
              </div>

              {form.exercises.map((ex, i) => (
                <div key={i} style={styles.exerciseCard}>
                  <input
                    placeholder="Exercise Name"
                    value={ex.name}
                    onChange={(e) => updateExercise(i, "name", e.target.value)}
                    style={styles.input}
                  />

                  <div style={styles.exerciseRow}>
                    <input
                      type="number"
                      placeholder="Sets"
                      value={ex.sets}
                      onChange={(e) =>
                        updateExercise(i, "sets", e.target.value)
                      }
                      style={styles.inputSmall}
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={ex.reps}
                      onChange={(e) =>
                        updateExercise(i, "reps", e.target.value)
                      }
                      style={styles.inputSmall}
                    />
                  </div>

                  <textarea
                    placeholder="Exercise Description"
                    value={ex.description}
                    onChange={(e) =>
                      updateExercise(i, "description", e.target.value)
                    }
                    style={styles.textareaSmall}
                  />

                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    style={styles.removeExerciseBtn}
                  >
                    Remove Exercise
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                {editing ? "Update Plan" : "Create Plan"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.cancelButton}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <h2 style={styles.subheading}>My Plans ({plans.length})</h2>

      <div style={styles.grid}>
        {plans.map((plan) => {
          const ratingVisible = plan.averageRating > 0;
          return (
            <div key={plan._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{plan.title}</h3>
                {ratingVisible && (
                  <div style={styles.rating}>
                    ⭐ {plan.averageRating.toFixed(1)}
                  </div>
                )}
              </div>

              <div style={styles.badges}>
                <span style={styles.badge}>{plan.category || "general"}</span>
                <span style={styles.badge}>
                  {plan.difficulty || "beginner"}
                </span>
              </div>

              <p style={styles.description}>{plan.description}</p>

              <div style={styles.planStats}>
                <div style={styles.planStat}>
                  <span style={styles.statLabel}>Price</span>
                  <span style={styles.statValue}>${plan.price}</span>
                </div>
                <div style={styles.planStat}>
                  <span style={styles.statLabel}>Duration</span>
                  <span style={styles.statValue}>{plan.duration} days</span>
                </div>
                <div style={styles.planStat}>
                  <span style={styles.statLabel}>Subscribers</span>
                  <span style={styles.statValue}>
                    {plan.subscriberCount || 0}
                  </span>
                </div>
                <div style={styles.planStat}>
                  <span style={styles.statLabel}>Reviews</span>
                  <span style={styles.statValue}>{plan.reviewCount || 0}</span>
                </div>
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(plan)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingTop: "1rem",
  },
  heading: {
    fontSize: "2rem",
    margin: 0,
  },
  button: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.5rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  formTitle: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    color: "#1f2937",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  inputSmall: {
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "1rem",
    minHeight: "100px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  textareaSmall: {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
    minHeight: "60px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  exercisesSection: {
    backgroundColor: "#f9fafb",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
  },
  exercisesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  exercisesTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    margin: 0,
  },
  addExerciseBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  exerciseCard: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #e5e7eb",
  },
  exerciseRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  removeExerciseBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    width: "100%",
  },
  formActions: {
    display: "flex",
    gap: "1rem",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#10b981",
    color: "white",
    padding: "1rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#6b7280",
    color: "white",
    padding: "1rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  subheading: {
    fontSize: "1.5rem",
    marginTop: "2rem",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.75rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    margin: 0,
    flex: 1,
  },
  rating: {
    fontSize: "0.875rem",
    color: "#f59e0b",
    fontWeight: "600",
  },
  badges: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  badge: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  description: {
    fontSize: "0.875rem",
    color: "#6b7280",
    lineHeight: "1.5",
    marginBottom: "1rem",
  },
  planStats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e5e7eb",
  },
  planStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    marginBottom: "0.25rem",
  },
  statValue: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#1f2937",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    padding: "0.75rem",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    color: "white",
    padding: "0.75rem",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontWeight: "600",
  },
};
