// import { useState } from "react";
// import axios from "axios";

// const ChatBot = () => {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState([]);

//   const handleSend = async () => {
//     if (!query) return;
//     const temp = query;
//     setQuery("");
//     setMessages((prev) => [...prev, { text: temp, type: "user" }]);

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/chat", { temp });
//       setMessages((prev) => [...prev, { text: res.data.reply, type: "ai" }]);
//     } catch {
//       setMessages((prev) => [...prev, { text: "Failed to get a response.", type: "ai" }]);
//     }
//   };

//   return (
//     <div style={styles.chatContainer}>
//       <div style={styles.messagesContainer}>
//         {messages.map((msg, i) => (
//           <div key={i} style={{ textAlign: msg.type === "user" ? "right" : "left" }}>
//             <p style={{
//               background: msg.type === "user" ? "#1976d2" : "#f5f5f5",
//               color: msg.type === "user" ? "#fff" : "#000",
//               padding: 5,
//               borderRadius: 5,
//               display: "inline-block"
//             }}>
//               {msg.text}
//             </p>
//           </div>
//         ))}
//       </div>
//       <input 
//         value={query} 
//         onChange={(e) => setQuery(e.target.value)} 
//         placeholder="Ask AI..." 
//         style={styles.input} 
//       />
//       <button onClick={handleSend} style={styles.sendButton}>Send</button>
//     </div>
//   );
// };

// const styles = {
//   chatContainer: {
//     position: "fixed",
//     bottom: "90px",
//     right: "20px",
//     width: "320px",
//     background: "white",
//     border: "1px solid black",
//     borderRadius: "10px",
//     padding: "10px",
//     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
//   },
//   messagesContainer: {
//     maxHeight: "200px",
//     overflowY: "auto",
//     marginBottom: "5px"
//   },
//   input: {
//     width: "100%",
//     marginBottom: "5px",
//     padding: "5px",
//     borderRadius: "5px",
//     border: "1px solid gray"
//   },
//   sendButton: {
//     width: "100%",
//     background: "#1976d2",
//     color: "white",
//     border: "none",
//     padding: "5px",
//     cursor: "pointer",
//     borderRadius: "5px"
//   }
// };

// export default ChatBot;
// import { useState, useRef, useEffect } from "react";
// import axios from "axios";

// const ChatBot = () => {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState([]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!query.trim()) return;
//     const userMessage = { text: query, type: "user" };
//     setQuery("");
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/chat", { query });
//       const aiMessage = { text: res.data.reply, type: "ai" };
//       setMessages((prev) => [...prev, aiMessage]);
//     } catch {
//       setMessages((prev) => [...prev, { text: "Failed to get a response.", type: "ai" }]);
//     }
//   };

//   return (
//     <div style={styles.chatContainer}>
//       <h3 style={styles.header}>AI ChatBot</h3>
//       <div style={styles.messagesContainer}>
//         {messages.map((msg, i) => (
//           <div key={i} style={{ ...styles.messageWrapper, justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}>
//             <p style={{
//               ...styles.message,
//               background: msg.type === "user" ? "#0078D7" : "#E3E3E3",
//               color: msg.type === "user" ? "white" : "black"
//             }}>
//               {msg.text}
//             </p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div style={styles.inputContainer}>
//         <input 
//           value={query} 
//           onChange={(e) => setQuery(e.target.value)} 
//           placeholder="Type your message..." 
//           style={styles.input} 
//         />
//         <button onClick={handleSend} style={styles.sendButton}>Send</button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   chatContainer: {
//     position: "fixed",
//     bottom: "50px",
//     right: "20px",
//     width: "350px",
//     background: "#fff",
//     borderRadius: "12px",
//     padding: "15px",
//     boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
//     display: "flex",
//     flexDirection: "column"
//   },
//   header: {
//     textAlign: "center",
//     margin: "0 0 10px 0",
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#333"
//   },
//   messagesContainer: {
//     maxHeight: "250px",
//     overflowY: "auto",
//     padding: "10px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "5px",
//     borderRadius: "8px",
//     background: "#f9f9f9"
//   },
//   messageWrapper: {
//     display: "flex"
//   },
//   message: {
//     padding: "10px",
//     borderRadius: "8px",
//     maxWidth: "75%",
//     wordWrap: "break-word"
//   },
//   inputContainer: {
//     display: "flex",
//     gap: "5px",
//     marginTop: "10px"
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//     outline: "none",
//     fontSize: "14px"
//   },
//   sendButton: {
//     background: "#0078D7",
//     color: "white",
//     border: "none",
//     padding: "10px 15px",
//     cursor: "pointer",
//     borderRadius: "8px",
//     fontSize: "14px"
//   }
// };

// export default ChatBot;
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMessage = { text: query, type: "user" };
    setQuery("");
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log(userMessage.text)
      const res = await axios.post("http://localhost:5000/api/auth/chat", {query: userMessage.text });
      const aiMessage = { text: res.data.reply, type: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [...prev, { text: "Failed to get a response.", type: "ai" }]);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h3 style={styles.header}>AI ChatBot</h3>
      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...styles.messageWrapper, justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}>
            <p style={{
              ...styles.message,
              background: msg.type === "user" ? "#0084FF" : "#F1F0F0",
              color: msg.type === "user" ? "white" : "black"
            }}>
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Type your message..." 
          style={styles.input} 
        />
        <button onClick={handleSend} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed",
    bottom: "60px",
    right: "40px",
    width: "380px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    textAlign: "center",
    margin: "0 0 15px 0",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#222"
  },
  messagesContainer: {
    maxHeight: "300px",
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRadius: "10px",
    background: "#f7f7f7"
  },
  messageWrapper: {
    display: "flex"
  },
  message: {
    padding: "12px",
    borderRadius: "10px",
    maxWidth: "80%",
    wordWrap: "break-word",
    fontSize: "14px"
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #bbb",
    outline: "none",
    fontSize: "15px"
  },
  sendButton: {
    background: "#0084FF",
    color: "white",
    border: "none",
    padding: "12px 18px",
    cursor: "pointer",
    borderRadius: "10px",
    fontSize: "15px"
  }
};

export default ChatBot;
