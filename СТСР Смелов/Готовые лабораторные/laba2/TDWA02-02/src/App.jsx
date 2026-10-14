import { useState } from "react";
import "./App.css";

const API = "https://localhost:20443/api/Save-JSON";

export default function App() {
  const [op, setOp] = useState("sub");
  const [x, setX] = useState(3);
  const [y, setY] = useState(5);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);

  async function send(method) {
    const opts = { method, headers: {} };

    if (method === "POST" || method === "PUT") {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify({ op, x: Number(x), y: Number(y) });
    }

    try {
      const res = await fetch(API, opts);
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      setStatus({ code: res.status, text: res.statusText });
      setResult(data);
    } catch (e) {
      setStatus({ code: 0, text: "Network error" });
      setResult(String(e));
    }
  }

  const ok = status && status.code >= 200 && status.code < 300;

  return (
    <div className="app">
      <h1>TDWA03-02</h1>
      <p className="subtitle">React SPA · запросы через NGINX (порт 20000)</p>

      <div className="panel">
        <label>
          op:
          <select value={op} onChange={(e) => setOp(e.target.value)}>
            <option>add</option>
            <option>sub</option>
            <option>mul</option>
            <option>div</option>
          </select>
        </label>
        <label>
          x:{" "}
          <input
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
        </label>
        <label>
          y:{" "}
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
        </label>
      </div>

      <div className="buttons">
        <button onClick={() => send("GET")}>GET</button>
        <button onClick={() => send("POST")}>POST</button>
        <button onClick={() => send("PUT")}>PUT</button>
        <button onClick={() => send("DELETE")}>DELETE</button>
      </div>

      <h2>Ответ сервера</h2>
      <div className={`status ${ok ? "ok" : "err"}`}>
        {status ? `HTTP ${status.code} ${status.text}` : "—"}
      </div>
      <pre className="result">
        {result ? JSON.stringify(result, null, 2) : ""}
      </pre>
    </div>
  );
}
