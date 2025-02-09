import { useState, useEffect } from "react";
import axios from "axios";
import { useAppStore } from "../store/index";
import Navbar from "./Navbar";
import VideoCard from "./VideoCard";
import SearchBar from "./SearchBar";
import ChatBot from "./ChatBot";


const Home = () => {
  const { userInfo } = useAppStore();
  const [user] = useState(userInfo || "");
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);
  

  useEffect(() => {
    axios
      .get("http://localhost:5000/video/getvideos")
      .then((response) => {
        let repeatedVideos = [];
        for (let i = 0; i < 15; i++) {
          repeatedVideos = repeatedVideos.concat(response.data);
        }
        setVideos(repeatedVideos);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <Navbar userInfo={userInfo} />
      <div style={userInfo?.isStudent ? styles.contentWithSidebar : styles.contentWithoutSidebar}>
        {userInfo?.isStudent && (
          <aside style={styles.sidebar}>
            <h3>Menu</h3>
            <ul style={styles.sidebarList}>
              <li><a href="/home" style={styles.sidebarLink}>Home</a></li>
              <li><a href="/open-doubts" style={styles.sidebarLink}>Open Doubts</a></li>
              <li><a href="/liked-videos" style={styles.sidebarLink}>Liked Videos</a></li>
              <li><a href="/others" style={styles.sidebarLink}>Others</a></li>
            </ul>
          </aside>
        )}
        <div style={userInfo?.isStudent ? styles.mainContentWithSidebar : styles.mainContentWithoutSidebar}>
          <h2 style={{ color: "black", textAlign: "center" }}>Welcome, {user?.username}</h2>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div style={styles.videoScrollContainer}>
            <div style={styles.videoRow}>
              {filteredVideos.map((video, index) => (
                <VideoCard key={index} video={video} />
              ))}
            </div>
          </div>
          <button style={styles.aiButton} onClick={() => setShowChatBot(!showChatBot)}>AI</button>
{showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
  },
  contentWithSidebar: {
    display: "flex",
    marginTop: "100px",
  },
  contentWithoutSidebar: {
    marginTop: "100px",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    height: "calc(100vh - 100px)",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    position: "fixed",
    left: 0,
    top: "100px",
    boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
  },
  sidebarList: {
    listStyleType: "none",
    padding: 0,
  },
  sidebarLink: {
    textDecoration: "none",
    color: "black",
    fontSize: "16px",
    display: "block",
    padding: "10px 0",
    fontWeight: "bold",
  },
  mainContentWithSidebar: {
    marginLeft: "270px",
    width: "calc(100% - 270px)",
    padding: "20px",
    overflowY: "auto",
    height: "calc(100vh - 100px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mainContentWithoutSidebar: {
    width: "100%",
    padding: "20px",
    overflowY: "auto",
    height: "calc(100vh - 100px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  videoScrollContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    width: "100%",
  },
  videoRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
  },
  aiButton: {
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
};





export default Home;