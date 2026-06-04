const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.json({ reply: "Please wait 15 seconds and try again!" });
    }

    // Safely parse the reply to prevent backend 500 crashes
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that response. Try again!";
    res.json({ reply });

  } catch (error) {
    console.error("Error Details:", error);
    res.status(500).json({ reply: "Something went wrong. Try again!" });
  }
});

app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});