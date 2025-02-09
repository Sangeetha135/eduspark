import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppStore } from "../store/index";

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore(); // Get user info from store

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/logout");
      if (res.status === 200) {
        setUserInfo(null); // Clear user info
        navigate("/"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUploadVideo = () => {
    navigate("/home/uploadvideo");
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>EduSpark</h1>
      <div style={styles.navLinks}>
        {/* Educator-specific options */}
        {userInfo && !userInfo.isStudent && (
          <>
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/open-doubts" style={styles.link}>Open Doubts</Link>
            <button onClick={handleUploadVideo} style={styles.uploadBtn}>Upload Video</button>
          </>
        )}
        {/* Profile option is shown to both students and educators */}
        <Link to="/profile" style={styles.link}>Profile</Link>
        {/* Logout button visible to both */}
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

// Styles for Navbar
const styles = {
  navbar: {
    height: "100px",
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "lightblue",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginLeft: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    fontSize: "16px",
    color: "black",
    fontWeight: "bold",
  },
  uploadBtn: {
    height: "40px",
    width: "120px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    transition: "background 0.3s",
  },
  logoutBtn: {
    height: "40px",
    width: "100px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#ff4d4d",
    color: "white",
    transition: "background 0.3s",
  },
};

export default Navbar;