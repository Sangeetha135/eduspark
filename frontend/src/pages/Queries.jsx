import { useState, useEffect } from "react";
import axios from "axios";
import { useAppStore } from "../store/index";
import { useNavigate } from "react-router-dom";
const Queries = () => {
  const { userInfo } = useAppStore();
  const [user] = useState(userInfo || "");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", description: "", postedBy: "" });
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/video/query/getqueries");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newQuestion.title && newQuestion.description && newQuestion.postedBy) {
      try {
        await axios.put(`http://localhost:5000/video/putquery/${user.username}`, {
          title: newQuestion.title,
          des: newQuestion.description,
          topic: newQuestion.topic,
        });

        // Refresh questions after posting
        const response = await axios.get("http://localhost:5000/video/query/getqueries");
        setQuestions(response.data);
        setNewQuestion({ title: "", description: "", postedBy: "" });
        setShowOverlay(false);
      } catch (error) {
        console.error("Error submitting question:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Student Questions</h2>
      <button onClick={() => setShowOverlay(true)} style={styles.askButton}>
        Ask a Question
      </button>

      {showOverlay && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <h3 style={styles.overlayHeading}>Post Your Question</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Question Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter your question title"
                  value={newQuestion.title}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your question in detail"
                  value={newQuestion.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  required
                ></textarea>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  name="postedBy"
                  placeholder="Enter your name"
                  value={newQuestion.postedBy}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>
                  Post Question
                </button>
                <button onClick={() => setShowOverlay(false)} style={styles.closeButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

<div style={styles.cardsContainer}>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div
            key={question.id}
            style={styles.card}
            onClick={() => navigate(`/chat/${question._id}`)} // ✅ Navigate on click
          >
            <h3 style={styles.cardTitle}>{question.title}</h3>
            <p style={styles.cardDescription}>{question.description}</p>
            <div style={styles.cardFooter}>
              <p style={styles.cardPostedBy}>
                <span style={styles.userIcon}>👤</span>
                {question.username}
              </p>
              <p style={styles.cardDate}>
                <span style={styles.calendarIcon}>📅</span>
                {new Date(question.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "2rem",
    fontWeight: 600,
    textAlign: "center",
  },
  askButton: {
    padding: "12px 30px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    margin: "20px 0",
    fontSize: "1.1rem",
    fontWeight: 600,
    transition: "all 0.3s ease",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(3px)",
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "15px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    color: "#34495e",
    fontWeight: 500,
  },
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "2px solid #dfe6e9",
    fontSize: "1rem",
  },
  textarea: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "2px solid #dfe6e9",
    height: "120px",
    resize: "vertical",
    fontSize: "1rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "flex-end",
  },
  submitButton: {
    padding: "12px 25px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  closeButton: {
    padding: "12px 25px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
    marginTop: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
};

export default Queries;
