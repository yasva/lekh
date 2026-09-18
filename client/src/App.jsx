import { useEffect, useState } from "react";
import "./App.css";
import { User, Lock, LogIn, LogOut } from "lucide-react";
import EquipmentDetails from "./components/EquipmentDetails";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/session", {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    async function loadEquipmentList() {
      if (!user) {
        return;
      }

      try {
        const response = await fetch("/api/equipment", {
          credentials: "include",
        });

        if (!response.ok) {
          setMessage("Unable to load equipment.");
          return;
        }

        const data = await response.json();
        setEquipmentList(data);
      } catch {
        setMessage("Unable to connect to the server.");
      }
    }

    loadEquipmentList();
  }, [user]);

  async function handleEquipmentSelect(id) {
    try {
      const equipmentResponse = await fetch(`/api/equipment/${id}`, {
        credentials: "include",
      });

      if (!equipmentResponse.ok) {
        setMessage("Unable to load equipment details.");
        return;
      }

      const equipmentData = await equipmentResponse.json();
      setEquipment(equipmentData);

      const guideResponse = await fetch(`/api/equipment/${id}/guide`, {
        credentials: "include",
      });

      if (!guideResponse.ok) {
        setGuide(null);
        setMessage("Unable to load equipment guide.");
        return;
      }

      const guideData = await guideResponse.json();
      setGuide(guideData);
      setMessage("");
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  async function handleGuideCreate(setup, usage) {
    try {
      const response = await fetch(`/api/equipment/${equipment.id}/guide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          setup,
          usage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setGuide(data);
      setMessage("Guide created successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

  async function handleGuideUpdate(setup, usage) {
    try {
      const response = await fetch(`/api/equipment/${equipment.id}/guide`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          setup,
          usage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setGuide(data);
      setMessage("Guide updated successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

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

      setUser(data.user);
      setMessage("");
      setUsername("");
      setPassword("");
    } catch {
      setMessage("Unable to connect to the server.");
      setPassword("");
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setUser(null);
      setMessage("You have been logged out.");
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  return (
    <main>
      <h1>LEKH</h1>

      {user ? (
        <>
          <p>Welcome, {user.username}!</p>

          <h2>Equipment</h2>

          {equipmentList.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleEquipmentSelect(item.id)}
            >
              {item.name}
            </button>
          ))}

          {equipment && (
            <EquipmentDetails
              equipment={equipment}
              guide={guide}
              user={user}
              onGuideCreate={handleGuideCreate}
              onGuideUpdate={handleGuideUpdate}
            />
          )}

          <button type="button" onClick={handleLogout}>
            <LogOut size={18} />
            Log out
          </button>
        </>
      ) : (
        <>
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
        </>
      )}

      {message && <p>{message}</p>}
    </main>
  );
}

export default App;
