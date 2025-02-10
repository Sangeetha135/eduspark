import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppStore } from "../store/index";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/logout");
      if (res.status === 200) {
        setUserInfo(null);
        navigate("/");
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
      <Link to="/queries" style={styles.link}>Open Doubts</Link>
        {userInfo && !userInfo.isStudent && (
          <>
            {/* <Link to="/home" style={styles.link}>Home</Link> */}
            
            <button onClick={handleUploadVideo} style={styles.uploadBtn}>Upload Video</button>
          </>
        )}

        {/* Profile Dropdown */}
        <div style={styles.profileContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div style={styles.profilePic}>{userInfo?.username?.charAt(0).toUpperCase()}</div>
          {dropdownOpen && (
            <div style={styles.dropdownMenu}>
              <Link to="/home" style={styles.dropdownItem}>Dashboard</Link>
              <Link to="/student" style={styles.dropdownItem}>Profile</Link>
              <button onClick={handleLogout} style={styles.dropdownItem}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// **Updated Navbar Styles**
const styles = {
  navbar: {
    height: "70px",
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(135deg,rgb(103, 173, 226),rgb(86, 140, 198))",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: "1px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginRight: "20px",
  },
  link: {
    textDecoration: "none",
    fontSize: "16px",
    color: "#fff",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
  uploadBtn: {
    height: "35px",
    width: "120px",
    fontSize: "14px",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
    padding: "5px 15px",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
  profileContainer: {
    position: "relative",
    cursor: "pointer",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid white",
    backgroundColor: "#007bff",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight:"30px"
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: "50px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    padding: "10px",
    width: "130px",
    display: "flex",
    flexDirection: "column",
  },
  dropdownItem: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#333",
    padding: "8px",
    borderRadius: "4px",
    textAlign: "center",
    transition: "background 0.3s ease",
  },
};

// **Hover Effects**
styles.uploadBtn[":hover"] = { backgroundColor: "#218838", transform: "scale(1.05)" };
styles.dropdownItem[":hover"] = { backgroundColor: "#f1f1f1" };

export default Navbar;