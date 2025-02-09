import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppStore } from "../store/index";

const ChatAnswers = () => {
  const { id } = useParams(); // Get question ID from URL
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ answer: "", isStudent: true });
  const { userInfo } = useAppStore();
  const [user] = useState(userInfo || "");

  // Fetch question and answers from backend
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/video/query/${id}`);
        setQuestion(response.data);
        setAnswers(response.data.answers);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setNewAnswer({ ...newAnswer, [e.target.name]: e.target.value });
  };

  // Submit answer to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newAnswer.answer) {
      

      try {
        await axios.put(`http://localhost:5000/video/query/answer/${id}`, {
          answer: newAnswer.answer,
          username: user.username,
          isStudent: user.isStudent,
        });
        const response = await axios.get(`http://localhost:5000/video/query/${id}`);
      setAnswers(response.data.answers); 

      // Reset form
      setNewAnswer({ answer: "", isStudent: true }); // Reset form
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      {question ? (
        <>
          <h2 style={styles.title}>{question.title}</h2>
          <p style={styles.description}>{question.description}</p>
          <p style={styles.username}>Posted by: {question.username}</p>

          <h3 style={styles.answerHeading}>Answers:</h3>
          {answers.length > 0 ? (
            answers.map((ans, index) => (
              <div key={index} style={styles.answerCard}>
                <p style={styles.answerText}>{ans.answer}</p>
                <p style={styles.answerUsername}>
                  {ans.username} {ans.isStudent ? "👨‍🎓" : "✅ Educator"}
                </p>
                <p style={styles.replayDate}>Answered on: {new Date(ans.replaydate).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No answers yet.</p>
          )}

          {/* Answer Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <textarea
              name="answer"
              placeholder="Write your answer..."
              value={newAnswer.answer}
              onChange={handleChange}
              required
              style={styles.textarea}
            />
            <button type="submit" style={styles.button}>Submit Answer</button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  description: {
    fontSize: "1.2rem",
    color: "#34495e",
  },
  username: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#16a085",
  },
  answerHeading: {
    marginTop: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2980b9",
  },
  answerCard: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "1rem",
  },
  answerText: {
    fontSize: "1.1rem",
    color: "#2c3e50",
  },
  answerUsername: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#8e44ad",
  },
  replayDate: {
    fontSize: "0.8rem",
    color: "#7f8c8d",
  },
  form: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "100px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ChatAnswers;
