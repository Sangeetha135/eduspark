import { useNavigate } from "react-router-dom";
import { useState } from "react";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <div style={styles.thumbnailContainer}>
        <img src={video.thumbnail} alt="Thumbnail" style={styles.thumbnail} />
      </div>

      <div style={styles.videoInfo}>
        <div style={styles.textContainer}>
          <h3 style={styles.videoTitle}>{video.title}</h3>
          <p style={styles.videoMeta}>⭐ {video.rating.toFixed(1)}</p>
        </div>

        {/* 3-dot menu */}
        <div style={styles.menuContainer} onClick={toggleMenu}>
          <span style={styles.dots}>⋮</span>
          {menuOpen && (
            <div style={styles.dropdownMenu}>
              <p style={styles.menuItem}>➕ Add to Watchlist</p>
              <p style={styles.menuItem}>❤️ Add to Favourites</p>
            </div>
          )}
        </div>
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
  cardHover: {
    transform: "scale(1.03)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", 
  },
  thumbnailContainer: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    borderRadius: "10px",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
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
  menuContainer: {
    position: "relative",
    cursor: "pointer",
  },
  dots: {
    fontSize: "18px",
    color: "#606060",
    padding: "5px",
  },
  dropdownMenu: {
    position: "absolute",
    top: "25px",
    right: "0",
    background: "#fff",
    borderRadius: "8px",
    padding: "8px 10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 10,
    minWidth: "160px",
    textAlign: "left",
  },
  menuItem: {
    color: "#333",
    fontSize: "14px",
    padding: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  menuItemHover: {
    background: "#f5f5f5",
  },
};

export default VideoCard;
