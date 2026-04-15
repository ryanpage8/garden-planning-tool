import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend Offline"))
  }, []);

  return (
    <div className="App">
      <h1>Garden Planning Tool</h1>
      <div className="card">
        <p>System Status: <strong>{message}</strong></p>
      </div>
    </div>
  )
}

export default App
