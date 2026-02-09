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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a short, catchy social media caption about: ${topic}`
        }
      ],
    });

    const caption = completion.choices[0].message.content;
    res.json({ caption });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.json({ caption: "❌ AI error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});