import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMsg = {
        type: "bot",
        text: data.response ? data.response.split("\n") : ["No response"],
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        { type: "bot", text: ["Error connecting to backend"] },
      ]);
    }

    setInput("");
  };

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">🎓 Academic Copilot</h2>

        <div className="chatBox">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.type === "user" ? "user" : "bot"}`}
            >
              {Array.isArray(msg.text)
                ? msg.text.map((line, idx) => (
                    <div key={idx} className="line">
                      {line}
                    </div>
                  ))
                : msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="inputBox">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about office hours..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button className="button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;