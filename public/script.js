const LIMIT = 3;

function getTodayKey() {
  const today = new Date().toISOString().split("T")[0];
  return `caption-count-${today}`;
}

function getUsage() {
  return Number(localStorage.getItem(getTodayKey())) || 0;
}

function incrementUsage() {
  localStorage.setItem(getTodayKey(), getUsage() + 1);
}

async function generate() {
  const topic = document.getElementById("topic").value;
  const platform = document.getElementById("platform").value;
  const result = document.getElementById("result");

  if (getUsage() >= LIMIT) {
    result.innerText = "❌ Daily free limit reached. Upgrade to Pro 🚀";
    return;
  }

  result.innerText = "⏳ Generating...";

  const res = await fetch("/generate-caption", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, platform })
  });

  const data = await res.json();
  incrementUsage();
  result.innerText = data.captions;
}