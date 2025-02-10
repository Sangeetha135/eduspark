import { useState, useEffect } from "react";
import axios from "axios";

export default function VideoComment({ videoId, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/video/comments/${videoId._id}`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [videoId]);

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:5000/video/putcomment/${videoId._id}/${userId}`,
          { text: newComment }
        );
        if (response.status === 200) {
          setComments(response.data);
          setNewComment("");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const postcomment = async (commentid, text) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/video/reply/${commentid}/${videoId._id}`,
        { text: text }
      );
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div style={styles.commentContainer}>
      <h2 style={styles.commentTitle}>Comments</h2>
      <div style={styles.commentInputContainer}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={styles.commentInput}
        />
        <button onClick={addComment} style={styles.commentButton}>
          Submit
        </button>
      </div>

      <div style={styles.commentList}>
        {comments.map((comment, index) => (
          <div
            key={comment._id}
            style={styles.commentCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.1)")
            }
          >
            <p style={styles.commentAuthor}>{comment.user ? comment.user.username : "You"}</p>
            <p style={styles.commentText}>{comment.text}</p>

            {comment.reply.trim() !== "" ? (
              <div style={styles.commentReply}>
                <p>
                  <strong>Reply:</strong> {comment.reply}
                </p>
              </div>
            ) : (
              <div style={styles.replyContainer}>
                <input
                  type="text"
                  placeholder="Reply to this comment..."
                  style={styles.replyInput}
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [comment._id]: e.target.value })
                  }
                  disabled={videoId.user._id !== userId}
                />
                <button
                  style={styles.replyButton}
                  onClick={() => postcomment(comment._id, replyText[comment._id])}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  commentContainer: {
    maxWidth: "90%",
    margin: "20px auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    boxSizing: "border-box",
  },
  commentTitle: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    color: "#333",
  },
  commentInputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  commentInput: {
    flexGrow: 1,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    transition: "border 0.3s ease",
  },
  commentButton: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  commentList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  commentCard: {
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    transition: "box-shadow 0.3s ease",
    cursor: "pointer",
    boxSizing: "border-box", // Ensures proper width alignment
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#333",
  },
  commentText: {
    color: "#555",
    margin: "5px 0",
  },
  commentReply: {
    background: "#e9ecef",
    padding: "10px",
    borderLeft: "3px solid #007bff",
    marginTop: "10px",
    borderRadius: "5px",
    width: "90%",
  },
  replyContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  replyInput: {
    flexGrow: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
  },
  replyButton: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
};
