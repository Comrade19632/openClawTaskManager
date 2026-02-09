import React from "react"
import { createRoot } from "react-dom/client"

function App() {
  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1>TaskManager</h1>
      <p>API health: <a href="/taskManager/api/health/" target="_blank" rel="noreferrer">/taskManager/api/health/</a></p>
    </div>
  )
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
