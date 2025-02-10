import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const RelatedVideos = ({ videoId }) => {
    const navigate=useNavigate();
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigateToVideo = (videoId) => {
    navigate(`/video/${videoId}`);
    window.location.reload(); // Forces reloading the page
  };
  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/video/related/${videoId}`);
        setRelatedVideos(response.data);
      } catch (error) {
        console.error("Error fetching related videos:", error);
      }
    };
    fetchRelatedVideos();
  }, [videoId]);

  if (relatedVideos.length === 0) {
    return <p style={styles.noRelated}>No related videos found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Related Videos</h2>
      <div style={styles.grid}>
        {relatedVideos.map((video) => (
          <div key={video._id} style={styles.card}>
            <video width="100%" controls>
              <source src={video.videolink} type="video/mp4" />
            </video>
            <h3>{video.title}</h3>
            <p><strong>Rating:</strong> {video.rating?.toFixed(1)}</p>
            <p><strong>Language:</strong> {video.language}</p>
            <p><strong>Uploaded by:</strong> {video.user?.username}</p>
            {/* <Link to={`/video/${video._id}`} style={styles.button}>Watch Video</Link> */}

            <button onClick={() => navigateToVideo(video._id)} style={styles.button}>
  Watch Video
</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;

const styles = {
  container: { marginTop: "40px", textAlign: "center" },
  heading: { fontSize: "22px", marginBottom: "20px", color: "#333" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" },
  card: { background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" },
  button: { display: "block", marginTop: "10px", textDecoration: "none", color: "white", background: "#007bff", padding: "10px", borderRadius: "5px" },
  noRelated: { textAlign: "center", fontSize: "16px", color: "#777", marginTop: "20px" },
};
