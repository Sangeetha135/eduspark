import React from "react";
import capMiddle from "../images/cap7.png";
import leftImage from "../images/cap5.png";
import rightImage from "../images/cap6.png";
import { useNavigate } from 'react-router-dom'

const styles = {
  homepage: {
    textAlign: "center",
    backgroundColor: "white",
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#f8f9fa",
    borderBottom: "2px solid #ddd",
    position: "relative",
    zIndex: 2,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  buttons: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
  hr: {
    margin: "0",
    border: "none",
    height: "2px",
    background: "#ddd",
    position: "relative",
    zIndex: 2,
  },
  capMiddle: {
    width: "300px",
    height: "250px",
    margin: "0 auto 20px auto",
    display: "block",
    position: "relative",
    zIndex: 2,
  },
  content: {
    fontSize: "20px",
    lineHeight: "1.5",
    color: "#333",
    position: "relative",
    zIndex: 2,
  },
  backgroundImages: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  image: {
    position: "absolute",
    width: "50vw",
    maxWidth: "390px",
    height: "500px",
  },
  leftImage: {
    bottom: "20px",
    left: "20px",
  },
  rightImage: {
    bottom: "20px",
    right: "20px",
  },
};

const LandingPage = () => {

  const navigate = useNavigate()
    const handleLogin = () => {
        navigate('/login')
    }
    const handleSignup = () => {
        navigate('/register')
    }

  return (
    <div style={styles.homepage}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>Eduspark</div>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={() => handleLogin()}>Login</button>
          <button style={styles.button} onClick={() => handleSignup()}>Sign Up</button>
        </div>
      </header>

      {/* Divider */}
      <hr style={styles.hr} />

      {/* Middle Cap Image */}
      <img src={capMiddle} alt="Graduation Cap Middle" style={styles.capMiddle} />

      {/* Main Content */}
      <div style={styles.content}>
        <p>Artificial Intelligence is revolutionizing education.</p>
        <p>AI-powered tools provide personalized learning experiences.</p>
        <p>Students and teachers benefit from smart automation.</p>
      </div>

      {/* Background Images */}
      <div style={styles.backgroundImages}>
        <img src={leftImage} alt="Graduation Left" style={{ ...styles.image, ...styles.leftImage }} />
        <img src={rightImage} alt="Graduation Right" style={{ ...styles.image, ...styles.rightImage }} />
      </div>
    </div>
  );
};

export default LandingPage;