
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAppStore } from "../store/index";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import VideoComment from "./VideoComment";
import VideoSubtitles from "./VideoSubtitles";

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [user] = useState(userInfo || "");
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/video/getvideo/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
  }, [id]);

  const handleSubmitRating = async () => {
    try {
      const temp = rating + (video.ratingcount * video.rating);
      const newRatingCount = video.ratingcount + 1;
      const newRating = temp / newRatingCount;
      await axios.put(`http://localhost:5000/video/rating/${id}`, { newRating, newRatingCount });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const takeQuiz = () => {
    navigate(`/video/takequiz/${video._id}`);
  };

  if (!video) return <h2 style={styles.loading}>Loading...</h2>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>{video.title}</h1>

        {/* Video and Subtitles Section */}
        <div style={styles.contentWrapper}>
          <div style={styles.videoSection}>
            <video controls style={styles.video} ref={videoRef}>
              <source src={video.videolink} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div style={styles.subtitlesSection}>
            <VideoSubtitles videoId={video._id} videoRef={videoRef} />
          </div>
        </div>

        {/* Video Details */}
        <div style={styles.detailsSection}>
          <p><strong>Uploaded by:</strong> {video.user?.username}</p>
          <p><strong>Rating:</strong> {video.rating?.toFixed(1)}</p>
          <p><strong>Description:</strong> {video.description}</p>
        </div>

        {/* Rating System */}
        <div style={styles.ratingSection}>
          <p><strong>Rate this video:</strong></p>
          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                style={{
                  ...styles.star,
                  color: (hover || rating) >= num ? "#FFD700" : "#ccc",
                }}
                onMouseEnter={() => setHover(num)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRating(num)}
              >
                ★
              </span>
            ))}
          </div>
          <button style={styles.button} onClick={handleSubmitRating} disabled={rating === null}>
            Submit Rating
          </button>
          {submitted && <p style={styles.thankYou}>Thank you for your rating!</p>}
        </div>

        {/* Summary Box */}
        <div style={styles.summaryBox}>Summary will be displayed here.</div>

        {/* Quiz Section */}
        <div style={styles.quizSection}>
          <button style={styles.button} onClick={takeQuiz}>Take Quiz</button>
        </div>

        {/* Comments Section (No Overlap with Navbar) */}
        <div style={styles.commentsSection}>
        <VideoComment videoId={video} userId={user?.id} />
        </div>
      </div>
    </>
  );
};

export default VideoDetail;

// Styles Object
const styles = {
  container: {
    width: "85%",
    margin: "80px auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "'Georgia', serif", // Changed font family
  },
  contentWrapper: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  videoSection: {
    flex: "2",
  },
  subtitlesSection: {
    flex: "1",
    textAlign: "left",
  },
  video: {
    width: "100%",
    borderRadius: "10px",
  },
  detailsSection: {
    textAlign: "left",
    marginTop: "20px",
    fontSize: "16px",
    color: "#444",
  },
  ratingSection: {
    marginTop: "20px",
  },
  stars: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    fontSize: "30px",
    cursor: "pointer",
  },
  star: {
    transition: "color 0.3s ease-in-out",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px", // Reduced button size
    fontSize: "14px", // Reduced font size
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s ease",
  },
  quizSection: {
    marginTop: "20px",
  },
  quizButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "6px 10px", // Smaller button size
    fontSize: "13px", // Smaller font size
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s ease",
  },
  summaryBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "5px",
    textAlign: "left",
  },
  commentsSection: {
    marginTop: "40px",
    padding: "20px",
    background: "#f1f1f1",
    borderRadius: "10px",
  },
  thankYou: {
    color: "green",
    fontSize: "14px",
    marginTop: "10px",
  },
  loading: {
    textAlign: "center",
    fontSize: "24px",
    color: "#888",
    marginTop: "50px",
  },
};
