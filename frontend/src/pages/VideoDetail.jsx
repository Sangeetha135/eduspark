import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const styles = {
  videoContainer: {
    maxWidth: "700px",
    margin: "100px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    background: "#fff",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  },
  videoTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  },
  videoPlayer: {
    width: "100%",
    maxWidth: "600px",
    borderRadius: "8px",
  },
  uploadedBy: {
    fontWeight: "bold",
    marginTop: "10px",
  },
  videoDescription: {
    fontSize: "16px",
    color: "#444",
    marginTop: "10px",
  },
  videoText: {
    fontWeight: "bold",
    color: "#007bff",
  },
  ratingContainer: {
    marginTop: "20px",
  },
  ratingStars: {
    fontSize: "24px",
    cursor: "pointer",
  },
  star: {
    color: "#ccc",
    transition: "color 0.3s",
    padding: "5px",
  },
  selectedStar: {
    color: "gold",
  },
  submitBtn: {
    display: "block",
    margin: "15px auto",
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submitBtnDisabled: {
    backgroundColor: "#ccc",
  },
  thankYou: {
    color: "green",
    fontWeight: "bold",
    marginTop: "10px",
  },
  quizBtn: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  quizBtnHover: {
    backgroundColor: "#0056b3",
  },
};

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [rating, setRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

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

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = async () => {
    try {
      const temp = rating + video.ratingcount * video.rating;
      const newRatingCount = video.ratingcount + 1;
      const newRating = temp / newRatingCount;
      const response = await axios.put(`http://localhost:5000/video/rating/${id}`, {
        newRating,
        newRatingCount,
      });
      console.log("Rating submitted:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const takeQuiz = async () => {
    navigate(`/video/takequiz/${video._id}`);
  };

  if (!video) return <h2>Loading...</h2>;

  return (
    <>
      <Navbar />
      <div style={styles.videoContainer}>
        <h1 style={styles.videoTitle}>{video.title}</h1>
        <video controls style={styles.videoPlayer}>
          <source src={video.videolink} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p style={styles.uploadedBy}>Uploaded by: {video.user?.username}</p>
        <p style={styles.videoDescription}>{video.description}</p>
        <p style={styles.videoText}>{video.text}</p>

        <div style={styles.ratingContainer}>
          <p>Rate this video:</p>
          <div style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                style={rating >= num ? { ...styles.star, ...styles.selectedStar } : styles.star}
                onMouseEnter={() => setRating(num)}
                onClick={() => handleRatingChange(num)}
              >
                ★
              </span>
            ))}
          </div>
          <button
            onClick={handleSubmitRating}
            disabled={rating === null}
            style={rating === null ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
          >
            Submit Rating
          </button>
          {submitted && <p style={styles.thankYou}>Thank you for your rating!</p>}
        </div>

        <button onClick={takeQuiz} style={styles.quizBtn}>
          Take Quiz/Test
        </button>
      </div>
    </>
  );
};

export default VideoDetail;
