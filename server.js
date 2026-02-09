const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
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
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Create a short, catchy social media caption about: ${topic}`
        })
      }
    );

    const data = await response.json();

    const caption =
      data?.[0]?.generated_text ||
      `🔥 ${topic} is trending right now!`;

    res.json({ caption });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.json({ caption: "❌ AI error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});