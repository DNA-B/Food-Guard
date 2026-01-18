document.addEventListener("DOMContentLoaded", () => {
  const checkButton = document.getElementById("checkNickname");
  const nicknameInput = document.getElementById("nickname");
  const messageElement = document.getElementById("nicknameMessage");
  const submitButton = document.querySelector('button[type="submit"]');

  if (!checkButton || !nicknameInput || !messageElement || !submitButton)
    return;

  const type = messageElement.dataset.type;

  submitButton.disabled = true;
  submitButton.classList.add("opacity-50", "cursor-not-allowed");

  checkButton.addEventListener("click", async () => {
    const nickname = nicknameInput.value.trim();

    messageElement.classList.add("hidden");
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    if (!nickname) {
      showMessage(messageElement.dataset.empty || "입력해주세요.", "red");
      return;
    }

    try {
      const response = await fetch("/auth/check/nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      const data = await response.json();

      if (!response.ok) {
        showMessage("서버 오류", "red");
        return;
      }

      const exists = data.isDuplicate; // true = 존재함

      if (type === "invite") {
        if (exists) {
          showMessage(messageElement.dataset.exists, "green");
          enableSubmit();
        } else {
          showMessage(messageElement.dataset.notExists, "red");
        }
      } else {
        if (exists) {
          showMessage(messageElement.dataset.exists, "red");
        } else {
          showMessage(messageElement.dataset.notExists, "green");
          enableSubmit();
        }
      }
    } catch {
      showMessage("네트워크 오류", "red");
    }
  });

  function showMessage(text, color) {
    messageElement.textContent = text;
    messageElement.className = "text-sm mt-1 block";
    messageElement.classList.remove("hidden");
    messageElement.classList.add(
      color === "green" ? "text-green-500" : "text-red-500",
    );
  }

  function enableSubmit() {
    submitButton.disabled = false;
    submitButton.classList.remove("opacity-50", "cursor-not-allowed");
  }
});
