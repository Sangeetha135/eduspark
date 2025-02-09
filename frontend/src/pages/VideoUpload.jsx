import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";

const VideoUpload = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [languages, setLanguages] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || !title || !languages || !description || !level) {
      alert("Please fill in all fields and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("languages", languages);
    formData.append("description", description);
    formData.append("level", level);

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/video/videoupload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Video uploaded successfully!");
        navigate("/home");
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Upload a Video</h2>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Languages (comma separated)"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          ></textarea>

          <input
            type="text"
            placeholder="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={styles.input}
          />

          {videoPreviewUrl && (
            <video style={styles.videoPreview} controls>
              <source src={videoPreviewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <button
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading, Please Wait..." : "Upload Video"}
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "20px",
  },
  formBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f9f9f9",
  },
  videoPreview: {
    width: "100%",
    marginTop: "15px",
    borderRadius: "8px",
    display: "block",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
};

export default VideoUpload;