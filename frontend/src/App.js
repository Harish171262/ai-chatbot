import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I am your AI Assistant. How can I help you today? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (loading) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://ai-chatbot-backend-ad8n.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry something went wrong!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Arial" }}>
      <div style={{ width: "400px", background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "#075e54", padding: "20px", textAlign: "center" }}>
          <h2 style={{ color: "white", margin: 0 }}>🤖 AI Chatbot</h2>
          <p style={{ color: "#25d366", margin: "5px 0 0 0", fontSize: "13px" }}>● Online</p>
        </div>

        {/* Chat Messages */}
        <div style={{ height: "400px", overflowY: "auto", padding: "15px", background: "#e5ddd5" }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px"
            }}>
              <div style={{
                background: msg.role === "user" ? "#dcf8c6" : "white",
                padding: "10px 15px",
                borderRadius: "10px",
                maxWidth: "75%",
                fontSize: "14px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
              <div style={{ background: "white", padding: "10px 15px", borderRadius: "10px", fontSize: "14px" }}>
                🤖 Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div style={{ padding: "15px", background: "#f0f0f0", display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "none", outline: "none", fontSize: "14px" }}
          />
          <button
            onClick={sendMessage}
            style={{ background: "#075e54", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px" }}
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;