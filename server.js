const express = require("express");
const path = require("path");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate-caption", async (req, res) => {
  const { topic, platform } = req.body;

  try {
    const prompt = `
Create 3 viral ${platform} captions about "${topic}".
Short, catchy, emoji-friendly, English.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      captions: completion.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});