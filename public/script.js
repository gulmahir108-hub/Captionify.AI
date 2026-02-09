async function generateCaption() {
  const topic = document.getElementById("topicInput").value;
  const resultDiv = document.getElementById("result");

  if (!topic) {
    resultDiv.innerText = "⚠️ Please enter a topic.";
    return;
  }

  resultDiv.innerText = "⏳ Generating caption...";

  try {
    const res = await fetch("/generate-caption", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();

    console.log("API RESPONSE:", data); // 👈 ÇOK ÖNEMLİ

    resultDiv.innerText = data.caption || "❌ No caption returned.";

  } catch (err) {
    console.error(err);
    resultDiv.innerText = "❌ Server error.";
  }
}