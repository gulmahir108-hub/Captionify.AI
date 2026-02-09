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

    const caption =
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content;

    if (!caption) {
      return res.json({ caption: "❌ AI returned empty response." });
    }

    res.json({ caption });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.json({ caption: "❌ AI error occurred." });
  }
});