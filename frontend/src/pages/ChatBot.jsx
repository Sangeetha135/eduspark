import { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!query) return;
    const temp = query;
    setQuery("");
    setMessages((prev) => [...prev, { text: temp, type: "user" }]);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/chat", { temp });
      setMessages((prev) => [...prev, { text: res.data.reply, type: "ai" }]);
    } catch {
      setMessages((prev) => [...prev, { text: "Failed to get a response.", type: "ai" }]);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.type === "user" ? "right" : "left" }}>
            <p style={{
              background: msg.type === "user" ? "#1976d2" : "#f5f5f5",
              color: msg.type === "user" ? "#fff" : "#000",
              padding: 5,
              borderRadius: 5,
              display: "inline-block"
            }}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Ask AI..." 
        style={styles.input} 
      />
      <button onClick={handleSend} style={styles.sendButton}>Send</button>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    background: "white",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
  },
  messagesContainer: {
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "5px"
  },
  input: {
    width: "100%",
    marginBottom: "5px",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid gray"
  },
  sendButton: {
    width: "100%",
    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    borderRadius: "5px"
  }
};

export default ChatBot;
