import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/index";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEducator, setEducator] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res = "";
      if (isEducator)
        res = await axios.post("http://localhost:5000/api/auth/loginEducator", { email, password });
      else
        res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setUserInfo(res.data.user);
        navigate("/home");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.box}>
        <h2 style={styles.title}>✨ Welcome Back! ✨</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.radioGroup}>
            <input
              type="checkbox"
              id="educator"
              checked={isEducator}
              onChange={() => setEducator(!isEducator)}
              style={styles.checkbox}
            />
            <label htmlFor="educator" style={styles.label}>Login as an Educator</label>
          </div>
          <button type="submit" style={styles.button}>
            Login 🚀
          </button>
        </form>
        <p style={styles.signupText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('https://t4.ftcdn.net/jpg/02/54/80/61/360_F_254806159_XDaYgRIDwydC3JQm2Tf0HMoxYr9DB7MY.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    color: "#000",
    fontWeight: "bold",
    textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)",
  },
  box: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.85)",
    padding: "40px",
    width: "400px",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0072ff",
    letterSpacing: "2px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #0072ff",
    borderRadius: "5px",
    fontSize: "16px",
    background: "#f9f9f9",
    color: "#333",
    transition: "0.3s",
    outline: "none",
  },
  radioGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  checkbox: {
    marginRight: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#0072ff",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #ff512f, #dd2476)",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#fff",
    boxShadow: "0 0 10px rgba(255, 20, 147, 0.5)",
    transition: "0.3s ease-in-out",
    outline: "none",
    marginTop: "10px",
  },
  signupText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#0072ff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
