import { useState } from "react";
import "./App.css";
import { User, Lock, LogIn } from "lucide-react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        setPassword("");
        return;
      }

      setMessage(`Welcome, ${data.user.username}!`);
      setUsername("");
      setPassword("");
    } catch {
      setMessage("Unable to connect to the server.");
      setPassword("");
    }
  }

  return (
    <main>
      <h1>LEKH</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          <User size={18} />
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="password">
          <Lock size={18} />
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">
          <LogIn size={18} />
          Log in
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}

export default App;
