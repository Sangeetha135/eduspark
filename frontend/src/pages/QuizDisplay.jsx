import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizDisplay() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [warning, setWarning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/video/takequiz/${id}`);
      const formattedQuiz = response.data.questions.map(q => ({
        ques: q.ques,
        options: [q.A, q.B, q.C, q.D],
        ans: q.ans,
        explanation: q.explanation
      }));
      setQuiz(formattedQuiz);
    } catch (err) {
      setError("Failed to fetch quiz. Please try again later.");
    }
    setLoading(false);
  };

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length !== quiz.length) {
      setWarning(true);
      return;
    }

    let correctCount = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.ans) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
    setWarning(false);
  };

  const goBackToVideo = () => {
    navigate(`/video/${id}`);
  };

  /** ✅ STYLING OBJECT */
  const styles = {
    pageContainer: {
      width: "100vw",
      minHeight: "100vh",
      background: `url("https://source.unsplash.com/1600x900/?online-learning,books,education") no-repeat center center/cover`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 20px",
      boxSizing: "border-box",
    },
    quizContainer: {
      width: "75%",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(10px)",
      textAlign: "center",
    },
    questionBox: (isHovered) => ({
      padding: "20px",
      marginBottom: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      borderLeft: "5px solid #007BFF",
      textAlign: "left",
      transition: "all 0.3s ease-in-out",
      ...(isHovered && { transform: "translateY(-2px)", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }),
    }),
    questionText: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      marginBottom: "10px",
      color: "#333",
    },
    optionLabel: {
      display: "block",
      padding: "12px",
      borderRadius: "6px",
      cursor: "pointer",
      marginBottom: "8px",
      border: "1px solid #ccc",
      transition: "0.3s",
    },
    correctOption: {
      backgroundColor: "#c3f2c3", // Light Green
      border: "1px solid #28a745",
    },
    incorrectOption: {
      backgroundColor: "#f8d7da", // Light Red
      border: "1px solid #dc3545",
    },
    explanationBox: {
      marginTop: "5px",
      padding: "10px",
      backgroundColor: "#d4edda", // Light Green for correct answers
      borderRadius: "6px",
      fontSize: "0.95rem",
    },
    submitButton: (disabled) => ({
      marginTop: "20px",
      padding: "12px 18px",
      backgroundColor: disabled ? "#cccccc" : "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      transition: "0.3s",
    }),
    backButton: {
      marginTop: "15px",
      padding: "10px 14px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
      marginLeft: "10px",
    },
    scoreContainer: {
      marginTop: "20px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#007BFF",
    },
    progressBarContainer: {
      width: "100%",
      backgroundColor: "#e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
      marginTop: "10px",
    },
    progressBar: (percentage) => ({
      width: `${percentage}%`,
      height: "20px",
      backgroundColor: percentage < 50 ? "#dc3545" : percentage < 75 ? "#ffc107" : "#28a745",
      transition: "width 0.5s ease-in-out",
    }),
    warningText: {
      color: "red",
      fontSize: "1rem",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.quizContainer}>
        <h2>📚 Quiz Based on the Story</h2>

        {loading && <p>Loading quiz...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {quiz.length > 0 && (
          <div>
            {quiz.map((q, index) => (
              <div
                key={index}
                style={styles.questionBox(hoveredIndex === index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <p style={styles.questionText}>{q.ques}</p>
                <div>
                  {q.options.map((option, i) => (
                    <label
                      key={i}
                      style={{
                        ...styles.optionLabel,
                        ...(submitted && selectedAnswers[index] === option
                          ? option === q.ans
                            ? styles.correctOption
                            : styles.incorrectOption
                          : {}),
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={selectedAnswers[index] === option}
                        onChange={() => handleAnswerSelection(index, option)}
                        disabled={submitted}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div style={styles.explanationBox}>
                    <strong>✅ Correct Answer:</strong> {q.ans} <br />
                    <strong>📖 Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}

            {submitted && (
              <div>
                <p style={styles.scoreContainer}>Your Score: {score}/{quiz.length}</p>
                <div style={styles.progressBarContainer}>
                  <div style={styles.progressBar((score / quiz.length) * 100)}></div>
                </div>
              </div>
            )}

            {!submitted && (
              <button style={styles.submitButton(false)} onClick={handleSubmitQuiz}>
                Submit Quiz
              </button>
            )}

            <button style={styles.backButton} onClick={goBackToVideo}>
              ⬅ Back to Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
