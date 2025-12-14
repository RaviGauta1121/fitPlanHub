"use client";

import { useState, useEffect } from "react";
// Not a fan of long import paths, but keeping it as-is for now
import {
  subscriptionService,
  workoutLogService,
  achievementService,
} from "../../../lib/auth";

import { useAuth } from "../../../context/AuthContext";
import StatsCard from "../../../components/StatsCard";
import WorkoutLogCard from "../../../components/WorkoutLogCard";
import AchievementBadge from "../../../components/AchievementBadge";

// Main dashboard for regular users (trainers/admins blocked below)
export default function UserDashboard() {
  const { user } = useAuth();

  // State is getting a bit long, might refactor later 🤷‍♂️
  const [subs, setSubs] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [badges, setBadges] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [planId, setPlanId] = useState("");
  const [tab, setTab] = useState("overview");

  const [workoutForm, setWorkoutForm] = useState({
    duration: "",
    caloriesBurned: "",
    notes: "",
    mood: "good",
    exercises: [],
  });

  // Fetch everything once user is available
  useEffect(() => {
    if (user?.role === "user") {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Subscriptions first because other things depend on it
      const subsRes = await subscriptionService.getUserSubscriptions();
      console.log("Loaded subs:", subsRes.data); // leaving this log for now
      setSubs(subsRes.data || []);

      // Stats can fail if user is brand new
      try {
        const statsRes = await workoutLogService.getStats();
        setUserStats(statsRes.data);
      } catch (err) {
        console.log("Stats not available yet");
        setUserStats({
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          averageDuration: 0,
          workoutsThisWeek: 0,
          workoutsThisMonth: 0,
        });
      }

      // Recent logs (limit hardcoded for now)
      try {
        const logsRes = await workoutLogService.getUserLogs({ limit: 10 });
        setLogs(logsRes.data || []);
      } catch (err) {
        console.log("No logs found");
        setLogs([]);
      }

      // Achievements are optional, so failing silently is fine
      try {
        const achRes = await achievementService.getUserAchievements();
        setBadges(achRes.data || []);
      } catch (err) {
        console.log("No achievements yet");
        setBadges([]);
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();

    if (!planId) {
      alert("Please select a plan");
      return;
    }

    try {
      await workoutLogService.createLog({
        planId,
        ...workoutForm,
        duration: Number(workoutForm.duration),
        caloriesBurned: Number(workoutForm.caloriesBurned) || 0,
      });

      alert("Workout logged successfully! 🎉");

      // Reset form manually (probably could be cleaner)
      setShowForm(false);
      setPlanId("");
      setWorkoutForm({
        duration: "",
        caloriesBurned: "",
        notes: "",
        mood: "good",
        exercises: [],
      });

      loadDashboardData();
    } catch (err) {
      console.error("Workout log error:", err);
      alert(
        "Error logging workout: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const deleteLog = async (id) => {
    if (!confirm("Delete this workout log?")) return;

    try {
      await workoutLogService.deleteLog(id);
      loadDashboardData();
    } catch (err) {
      alert("Failed to delete log");
    }
  };

  // Exercise helpers (a bit verbose but readable)
  const addExercise = () => {
    setWorkoutForm((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { exerciseName: "", setsCompleted: "", repsCompleted: "", weight: "" },
      ],
    }));
  };

  const updateExercise = (idx, key, value) => {
    const copy = [...workoutForm.exercises];
    copy[idx][key] = value;
    setWorkoutForm({ ...workoutForm, exercises: copy });
  };

  const removeExercise = (idx) => {
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.filter((_, i) => i !== idx),
    });
  };

  // Hard stop if wrong role
  if (user?.role !== "user") {
    return <div>Access denied</div>;
  }

  // Active plans only
  const activePlans = subs.filter((s) => new Date(s.endDate) > new Date());

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>My Dashboard</h1>
        <button
          style={styles.logButton}
          disabled={activePlans.length === 0}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Log Workout"}
        </button>
      </div>

      {activePlans.length === 0 && (
        <div style={styles.noPlansMessage}>
          <p>
            ⚠️ You don't have any active subscriptions. Subscribe to a plan to
            start logging workouts!
          </p>
        </div>
      )}

      {showForm && activePlans.length > 0 && (
        <div style={styles.logForm}>
          <h2 style={styles.formTitle}>Log Your Workout</h2>

          <form onSubmit={handleWorkoutSubmit}>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">
                Select a plan ({activePlans.length} active)
              </option>
              {activePlans.map((s) => (
                <option key={s._id} value={s.plan._id}>
                  {s.plan.title}
                </option>
              ))}
            </select>

            <div style={styles.formRow}>
              <input
                type="number"
                min="1"
                required
                placeholder="Duration (minutes)"
                value={workoutForm.duration}
                onChange={(e) =>
                  setWorkoutForm({ ...workoutForm, duration: e.target.value })
                }
                style={styles.input}
              />

              <input
                type="number"
                min="0"
                placeholder="Calories Burned (optional)"
                value={workoutForm.caloriesBurned}
                onChange={(e) =>
                  setWorkoutForm({
                    ...workoutForm,
                    caloriesBurned: e.target.value,
                  })
                }
                style={styles.input}
              />
            </div>

            <select
              value={workoutForm.mood}
              onChange={(e) =>
                setWorkoutForm({ ...workoutForm, mood: e.target.value })
              }
              style={styles.input}
            >
              <option value="excellent">😄 Excellent</option>
              <option value="good">😊 Good</option>
              <option value="average">😐 Average</option>
              <option value="tired">😓 Tired</option>
              <option value="exhausted">😫 Exhausted</option>
            </select>

            <div style={styles.exercisesSection}>
              <div style={styles.exercisesHeader}>
                <h3 style={styles.exercisesTitle}>Exercises (Optional)</h3>
                <button
                  type="button"
                  onClick={addExercise}
                  style={styles.addExerciseBtn}
                >
                  + Add Exercise
                </button>
              </div>

              {workoutForm.exercises.length === 0 && (
                <p style={styles.noExercises}>
                  No exercises added yet. Click "Add Exercise" to add one.
                </p>
              )}

              {workoutForm.exercises.map((ex, i) => (
                <div key={i} style={styles.exerciseRow}>
                  <input
                    placeholder="Exercise name"
                    value={ex.exerciseName}
                    onChange={(e) =>
                      updateExercise(i, "exerciseName", e.target.value)
                    }
                    style={styles.exerciseInput}
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Sets"
                    value={ex.setsCompleted}
                    onChange={(e) =>
                      updateExercise(i, "setsCompleted", e.target.value)
                    }
                    style={styles.exerciseInputSmall}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Reps"
                    value={ex.repsCompleted}
                    onChange={(e) =>
                      updateExercise(i, "repsCompleted", e.target.value)
                    }
                    style={styles.exerciseInputSmall}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Weight (kg)"
                    value={ex.weight}
                    onChange={(e) =>
                      updateExercise(i, "weight", e.target.value)
                    }
                    style={styles.exerciseInputSmall}
                  />
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    style={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Notes (optional)"
              value={workoutForm.notes}
              onChange={(e) =>
                setWorkoutForm({ ...workoutForm, notes: e.target.value })
              }
              style={styles.textarea}
            />

            <button type="submit" style={styles.submitButton}>
              Save Workout
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setTab("overview")}
          style={tab === "overview" ? styles.activeTab : styles.tab}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("workouts")}
          style={tab === "workouts" ? styles.activeTab : styles.tab}
        >
          Workout History
        </button>
        <button
          onClick={() => setTab("subscriptions")}
          style={tab === "subscriptions" ? styles.activeTab : styles.tab}
        >
          My Plans
        </button>
        <button
          onClick={() => setTab("achievements")}
          style={tab === "achievements" ? styles.activeTab : styles.tab}
        >
          Achievements
        </button>
      </div>

      {tab === "overview" && userStats && (
        <>
          <div style={styles.statsGrid}>
            <StatsCard
              title="Total Workouts"
              value={userStats.totalWorkouts}
              icon="🏋️"
              subtitle="All time"
            />
            <StatsCard
              title="This Week"
              value={userStats.workoutsThisWeek}
              icon="📅"
              subtitle={`${userStats.workoutsThisMonth} this month`}
            />
            <StatsCard
              title="Total Time"
              value={`${Math.round(userStats.totalDuration / 60)}h`}
              icon="⏱️"
              subtitle={`${Math.round(userStats.averageDuration)} min avg`}
            />
            <StatsCard
              title="Calories Burned"
              value={userStats.totalCalories.toLocaleString()}
              icon="🔥"
              subtitle="Total"
            />
          </div>

          <h2 style={styles.subheading}>Recent Workouts</h2>
          {logs.length === 0 ? (
            <div style={styles.empty}>
              <p>
                No workouts logged yet. Start by logging your first workout!
              </p>
            </div>
          ) : (
            <div style={styles.logsGrid}>
              {logs.slice(0, 5).map((l) => (
                <WorkoutLogCard key={l._id} log={l} onDelete={deleteLog} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "workouts" && (
        <>
          <h2 style={styles.subheading}>All Workout Logs</h2>
          {logs.length === 0 ? (
            <div style={styles.empty}>No workout logs found</div>
          ) : (
            <div style={styles.logsGrid}>
              {logs.map((l) => (
                <WorkoutLogCard key={l._id} log={l} onDelete={deleteLog} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "subscriptions" && (
        <>
          <h2 style={styles.subheading}>My Subscribed Plans</h2>
          {subs.length === 0 ? (
            <div style={styles.empty}>
              No subscriptions yet. Browse plans to get started!
            </div>
          ) : (
            <div style={styles.subsGrid}>
              {subs.map((s) => {
                const active = new Date(s.endDate) > new Date();
                return (
                  <div key={s._id} style={styles.subCard}>
                    <h3 style={styles.subTitle}>{s.plan?.title}</h3>
                    <p style={styles.subTrainer}>By: {s.plan?.trainer?.name}</p>
                    <div style={styles.subDetails}>
                      <p>Amount: ${s.amount}</p>
                      <p>Start: {new Date(s.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(s.endDate).toLocaleDateString()}</p>
                    </div>
                    <span
                      style={
                        active ? styles.statusActive : styles.statusExpired
                      }
                    >
                      {active ? "✓ Active" : "✕ Expired"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "achievements" && (
        <>
          <h2 style={styles.subheading}>Your Achievements</h2>
          {badges.length === 0 ? (
            <div style={styles.empty}>
              Keep working out to unlock achievements! 🏆
            </div>
          ) : (
            <div style={styles.achievementsGrid}>
              {badges.map((a) => (
                <AchievementBadge key={a._id} achievement={a} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingTop: "1rem",
  },
  heading: {
    fontSize: "2rem",
    margin: 0,
  },
  logButton: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  noPlansMessage: {
    backgroundColor: "#fef3c7",
    border: "1px solid #fbbf24",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#78350f",
    fontWeight: "600",
  },
  logForm: {
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
  textarea: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "1rem",
    minHeight: "80px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  exercisesSection: {
    backgroundColor: "#f9fafb",
    padding: "1rem",
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
    fontSize: "1rem",
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
  noExercises: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "0.875rem",
    padding: "1rem",
  },
  exerciseRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  exerciseInput: {
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
  },
  exerciseInputSmall: {
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
  },
  removeBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    padding: "0.5rem",
    fontSize: "1rem",
    width: "35px",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#10b981",
    color: "white",
    padding: "1rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    borderBottom: "2px solid #e5e7eb",
  },
  tab: {
    padding: "0.75rem 1.5rem",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: "600",
    color: "#6b7280",
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
  },
  activeTab: {
    padding: "0.75rem 1.5rem",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: "600",
    color: "#2563eb",
    borderBottom: "2px solid #2563eb",
    marginBottom: "-2px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  subheading: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    color: "#6b7280",
  },
  logsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  subsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  subCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    position: "relative",
  },
  subTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#1f2937",
  },
  subTrainer: {
    color: "#6b7280",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
  subDetails: {
    fontSize: "0.875rem",
    color: "#4b5563",
    marginBottom: "1rem",
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    display: "inline-block",
  },
  statusExpired: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    display: "inline-block",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
};
