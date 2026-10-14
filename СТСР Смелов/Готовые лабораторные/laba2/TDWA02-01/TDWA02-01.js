// Страница отдаётся с того же origin (http://localhost:20000),
// поэтому запрос к API — same-origin, без CORS.
const API = "http://localhost:20000/api/Save-JSON";

const $op = document.getElementById("op");
const $x = document.getElementById("x");
const $y = document.getElementById("y");
const $status = document.getElementById("status");
const $result = document.getElementById("result");

function showStatus(code, text) {
  $status.textContent = `HTTP ${code} ${text || ""}`.trim();
  $status.className = "status " + (code >= 200 && code < 300 ? "ok" : "err");
}

function showResult(data) {
  $result.textContent =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

async function send(method) {
  const opts = { method, headers: {} };

  if (method === "POST" || method === "PUT") {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify({
      op: $op.value,
      x: Number($x.value),
      y: Number($y.value),
    });
  }

  try {
    const res = await fetch(API, opts);

    let data;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    showStatus(res.status, res.statusText);
    showResult(data);
  } catch (e) {
    showStatus(0, "Network error");
    showResult(String(e));
  }
}

document.querySelectorAll("button[data-method]").forEach((btn) => {
  btn.addEventListener("click", () => send(btn.dataset.method));
});
