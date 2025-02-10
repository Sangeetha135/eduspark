import { useNavigate } from "react-router-dom";
import { useState } from "react";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <div style={styles.thumbnailContainer}>
        <video src={video.videolink} alt={video.title} style={styles.video} />
      </div>

      <div style={styles.videoInfo}>
        <div style={styles.textContainer}>
          <h3 style={styles.videoTitle}>{video.title}</h3>
          <p style={styles.videoMeta}>⭐ {video.rating.toFixed(1)}</p>
        </div>

        <p style={styles.authorName}>{video.user.username}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "320px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.3s",
    position: "relative",
    background: "#fff",
    borderRadius: "10px",
    padding: "8px",
    border: "none",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  thumbnailContainer: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    borderRadius: "10px",
  },
  video: {
    width: "100%",
    height: "150px",
    display: "block",
  },
  videoInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 5px",
    color: "#333",
  },
  textContainer: {
    flex: 1,
  },
  videoTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "5px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  videoMeta: {
    fontSize: "13px",
    color: "#606060",
    margin: 0,
  },
  // Styled Author Name
  authorName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0073e6",
    margin: "0",
    padding: "5px 10px",
    borderRadius: "5px",
    backgroundColor: "#f0f7ff",
    textAlign: "right",
  },
};

export default VideoCard;
