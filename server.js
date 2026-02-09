const express = require("express");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate-caption", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.json({ caption: "⚠️ Please enter a topic." });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Create a short, catchy social media caption about: ${topic}`
        })
      }
    );

    const data = await response.json();

    const caption =
      Array.isArray(data) && data[0] && data[0].generated_text
        ? data[0].generated_text
        : `🔥 ${topic} is trending right now. Don't miss it!`;

    res.json({ caption });

  } catch (error) {
    console.error("HF ERROR:", error);
    res.json({ caption: "❌ AI error occurred." });
  }
});