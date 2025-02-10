import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isEducator, setEducator] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            let res = "";
            if (isEducator) {
                res = await axios.post("http://localhost:5000/api/auth/registerEducator", {
                    username,
                    email,
                    password
                });
            } else {
                res = await axios.post("http://localhost:5000/api/auth/register", {
                    username,
                    email,
                    password
                });
            }

            if (res.status === 201) {
                navigate("/login");
            } else {
                navigate("/register");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.box}>
                <h2 style={styles.title}>✨ Create Your Account ✨</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleRegister}>

                    <div style={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

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
                        <label htmlFor="educator" style={styles.label}>Register as an Educator</label>
                    </div>

                    <div style={styles.loginLink}>
                        <p style={styles.linkText}>
                            Already have an account? <span onClick={() => navigate("/login")} style={styles.link}>Login here</span>
                        </p>
                    </div>

                    <button type="submit" style={styles.button}>
                        Sign Up 🚀
                    </button>

                </form>
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
    loginLink: {
        marginBottom: "10px",
    },
    linkText: {
        fontSize: "14px",
    },
    link: {
        color: "#0072ff",
        cursor: "pointer",
        textDecoration: "underline",
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
};

export default Register;
