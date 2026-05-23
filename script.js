async function askSubmit() {
  const input = document.getElementById("askInput");
  const history = document.getElementById("askHistory");
  const question = input.value.trim();

  if (!question) return;

  history.innerHTML += `<div><strong>You:</strong> ${escapeHtml(question)}</div>`;
  input.value = "";

  history.innerHTML += `<div><strong>Assistant:</strong> Thinking...</div>`;
  history.scrollTop = history.scrollHeight;

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();

    const thinking = history.querySelector("div:last-child");
    thinking.innerHTML = `<strong>Assistant:</strong> ${escapeHtml(data.reply || data.error || "No response received.")}`;

  } catch (error) {
    const thinking = history.querySelector("div:last-child");
    thinking.innerHTML = `<strong>Assistant:</strong> Sorry, the assistant could not connect.`;
  }

  history.scrollTop = history.scrollHeight;
}

function askQuick(text) {
  const input = document.getElementById("askInput");
  input.value = text;
  askSubmit();
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("askInput");
  if (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askSubmit();
      }
    });
  }
});
