const form = document.querySelector("[data-login-form]");
const message = document.querySelector("[data-login-message]");

function setMessage(text, type = "") {
  message.textContent = text;
  message.classList.toggle("is-error", type === "error");
  message.classList.toggle("is-success", type === "success");
}

function getNextUrl() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "admin.html";
  if (next.startsWith("//") || next.includes("..") || !/^[A-Za-z0-9_./-]+$/.test(next)) {
    return "admin.html";
  }
  return next;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.error || "请求失败");
  }
  return data;
}

async function redirectIfLoggedIn() {
  try {
    await api("/api/session");
    window.location.href = getNextUrl();
  } catch {
    // Stay on login page.
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  setMessage("正在登录...");

  try {
    await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password")
      })
    });
    setMessage("登录成功，正在进入后台。", "success");
    window.location.href = getNextUrl();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

redirectIfLoggedIn();
