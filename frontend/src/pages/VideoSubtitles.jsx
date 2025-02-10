import { useEffect, useState, useRef } from "react";
import axios from "axios";

const VideoSubtitles = ({ videoId, videoRef }) => {
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const subtitleContainerRef = useRef(null);


  // Fetch subtitles in selected language
  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/video/subtitles/${videoId}/${selectedLanguage}`
        );
        if (response.status === 200) {
          setSubtitles(response.data);
          setCurrentSubtitleIndex(-1); // Reset current subtitle when language changes
        }
      } catch (error) {
        console.error("Error fetching subtitles:", error);
      }
    };

    fetchSubtitles();
  }, [videoId, selectedLanguage]);

  // Auto-scroll subtitles
  useEffect(() => {
    const updateSubtitle = () => {
      if (!videoRef.current) return;

      const currentTime = videoRef.current.currentTime;
      const newIndex = subtitles.findIndex(
        (s) => 
          currentTime >= parseFloat(s.start) && 
          currentTime < parseFloat(s.end) // Use < to avoid boundary overlaps
      );

      if (newIndex !== currentSubtitleIndex) {
        setCurrentSubtitleIndex(newIndex);

        // Auto-scroll to active subtitle
        if (newIndex !== -1 && subtitleContainerRef.current) {
          const activeElement = subtitleContainerRef.current.children[newIndex];
          activeElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // Better for small containers
          });
        }
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", updateSubtitle);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", updateSubtitle);
      }
    };
  }, [subtitles, videoRef, currentSubtitleIndex]);

  return (
    <div style={styles.container}>
      <div style={styles.languageSelector}>
        <label>Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={styles.selectBox}
        >
          <option value="English">English</option>
          <option value="Telugu">Telugu</option>
          <option value="Hindi">Hindi</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          {/* <option value="Malayalam">Malayalam</option>
          <option value="Tamil">Tamil</option>
          <option value="Kannada">Kannada</option>
          <option value="Portuguese">Portuguese</option> */}
        </select>
      </div>

      {/* Subtitles Container */}
      <div ref={subtitleContainerRef} style={styles.subtitleBox}>
        {subtitles.length === 0 ? (
          <p style={styles.loadingText}>Loading subtitles...</p>
        ) : (
          subtitles.map((subtitle, index) => (
            <div
              key={index}
              style={{
                ...styles.subtitleItem,
                ...(currentSubtitleIndex === index ? styles.activeSubtitle : {}),
              }}
            >
              {subtitle.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    background: "#0A3D62",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    color: "white",
  },
  languageSelector: {
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    color: "#FFD700",
  },
  selectBox: {
    marginLeft: "10px",
    padding: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#333",
  },
  subtitleBox: {
    width: "400px",
    height: "340px",
    overflowY: "auto",
    border: "2px solid #FFD700",
    padding: "10px",
    borderRadius: "8px",
    background: "#000",
    textAlign: "center",
    scrollBehavior: "smooth",
  },
  subtitleItem: {
    padding: "10px",
    margin: "4px 0",
    fontWeight: "normal",
    color: "white",
    transition: "all 0.3s ease",
    borderRadius: "4px",
  },
  activeSubtitle: {
    fontWeight: "bold",
    backgroundColor: "#FFD700",
    color: "black",
    transition: "all 0.3s ease-in-out",
  },
  loadingText: {
    color: "#fff",
    fontStyle: "italic",
  },
};

export default VideoSubtitles;
