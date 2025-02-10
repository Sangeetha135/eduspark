import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/index";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAppStore();
  const [user] = useState(userInfo || "");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/student-profile/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) return <div style={styles.loader}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.profileCard}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          style={styles.name}
          whileHover={{ scale: 1.1, color: "#007bff" }}
          transition={{ duration: 0.3 }}
        >
          {student.username}
        </motion.h2>
        <p style={styles.email}>{student.email}</p>

        <div style={styles.stats}>
          <StatBox value={student.score} label="Score" />
          <StatBox value={student.quizParticipated} label="Quizzes Taken" />
        </div>

        <div style={styles.progressContainer}>
          <p style={styles.levelText}>Level: {student.level}</p>
        </div>

        <div style={styles.topicsContainer}>
          <h3 style={styles.sectionTitle}>Topics Covered</h3>
          <ul style={styles.topicList}>
            {student.topic.map((topic, index) => (
              <TopicItem key={index} topic={topic} />
            ))}
          </ul>
        </div>

        <div style={styles.streakContainer}>
          <h3 style={styles.sectionTitle}>Streak History</h3>
          <div style={styles.streakRow}>
            {student.streakHistory.map((entry, index) => (
              <StreakBar key={index} streak={entry.streak} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatBox = ({ value, label }) => (
  <motion.div
    style={styles.statBox}
    whileHover={{ scale: 1.1, boxShadow: "0 5px 15px rgba(0, 123, 255, 0.3)" }}
    transition={{ duration: 0.3 }}
  >
    <h3>{value}</h3>
    <p>{label}</p>
  </motion.div>
);

const TopicItem = ({ topic }) => (
  <motion.li
    style={styles.topicItem}
    whileHover={{ scale: 1.1, background: "#007bff", color: "#fff" }}
    transition={{ duration: 0.3 }}
  >
    {topic}
  </motion.li>
);

const StreakBar = ({ streak }) => (
  <motion.div
    style={{ ...styles.streakBar, height: `${streak * 20}px` }}
    whileHover={{ scale: 1.1, background: "#007bff", color: "#fff" }}
    transition={{ duration: 0.3 }}
  >
    {streak}
  </motion.div>
);

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    padding: "20px",
  },
  profileCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  loader: { fontSize: "20px", fontWeight: "bold", textAlign: "center", color: "#fff" },
  error: { fontSize: "18px", fontWeight: "bold", textAlign: "center", color: "#ff4d4d" },
  name: { fontSize: "26px", fontWeight: "bold", marginBottom: "10px" },
  email: { fontSize: "14px", color: "#555", marginBottom: "20px" },
  stats: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  statBox: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
    margin: "0 10px",
    textAlign: "center",
    cursor: "pointer",
  },
  topicsContainer: { marginTop: "20px", textAlign: "center" },
  topicList: { listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", justifyContent: "center" },
  topicItem: { background: "#eee", padding: "10px 15px", borderRadius: "6px", margin: "5px", fontSize: "14px", cursor: "pointer" },
  streakRow: { display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "8px", height: "100px" },
  streakBar: { width: "40px", background: "#ff6b6b", color: "#fff", borderRadius: "6px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "bold", transition: "all 0.3s ease-in-out" },
};

export default StudentProfile;
