import { useEffect, useState } from "react";
import "./App.css";
import {
  User,
  UserPlus,
  Lock,
  LogIn,
  LogOut,
  FlaskConical,
  Menu,
  X,
} from "lucide-react";
import EquipmentDetails from "./components/EquipmentDetails";
import EquipmentForm from "./components/EquipmentForm";
import MyLoans from "./components/MyLoans";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [equipmentCondition, setEquipmentCondition] = useState("");
  const [guide, setGuide] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showEditEquipmentForm, setShowEditEquipmentForm] = useState(false);
  const [troubleshooting, setTroubleshooting] = useState([]);
  const [units, setUnits] = useState([]);
  const [page, setPage] = useState("equipment");
  const [myLoans, setMyLoans] = useState([]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [message]);

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

      if (guideResponse.status === 404) {
        setGuide(null);
      } else if (!guideResponse.ok) {
        setGuide(null);
        setMessage("Unable to load equipment guide.");
        return;
      } else {
        const guideData = await guideResponse.json();
        setGuide(guideData);
      }

      const troubleshootingResponse = await fetch(
        `/api/equipment/${id}/troubleshooting`,
        {
          credentials: "include",
        },
      );

      if (!troubleshootingResponse.ok) {
        setTroubleshooting([]);
        setMessage("Unable to load troubleshooting information.");
        return;
      }

      const troubleshootingData = await troubleshootingResponse.json();
      setTroubleshooting(troubleshootingData);

      const unitsResponse = await fetch(`/api/equipment/${id}/units`, {
        credentials: "include",
      });

      if (!unitsResponse.ok) {
        setUnits([]);
        setMessage("Unable to load units.");
        return;
      }

      const unitsData = await unitsResponse.json();
      setUnits(unitsData);

      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  async function handleEquipmentCreate(equipmentData) {
    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(equipmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setEquipmentList((currentList) =>
        [...currentList, data].sort((a, b) => a.name.localeCompare(b.name)),
      );

      setMessage("Equipment created successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

  async function handleEquipmentUpdate(equipmentData) {
    try {
      const response = await fetch(`/api/equipment/${equipment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(equipmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setEquipment(data);

      setEquipmentList((currentList) =>
        currentList
          .map((item) => (item.id === data.id ? data : item))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );

      setMessage("Equipment updated successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

  async function handleLoanRequest(equipmentUnitId, startDate, endDate) {
    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          equipmentUnitId,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setMessage("Loan request submitted and is waiting for approval.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

  async function refreshEquipment(id) {
    const response = await fetch(`/api/equipment/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }

    const updatedEquipment = await response.json();

    setEquipment(updatedEquipment);
    setEquipmentList((currentList) =>
      currentList.map((item) =>
        item.id === updatedEquipment.id ? updatedEquipment : item,
      ),
    );
  }

  async function handleUnitCreate(unitData) {
    try {
      const response = await fetch(`/api/equipment/${equipment.id}/units`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(unitData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setUnits((current) =>
        [...current, data].sort((a, b) =>
          a.identifier.localeCompare(b.identifier),
        ),
      );
      await refreshEquipment(equipment.id);
      setMessage("Unit added successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

  async function handleUnitUpdate(unitId, unitData) {
    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(unitData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setUnits((current) =>
        current.map((unit) => (unit.id === data.id ? data : unit)),
      );
      await refreshEquipment(equipment.id);
      setMessage("Unit updated successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
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

  async function handleTroubleshootingCreate(problem, solution) {
    try {
      const response = await fetch(
        `/api/equipment/${equipment.id}/troubleshooting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            problem,
            solution,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setTroubleshooting((current) => [...current, data]);
      setMessage("Troubleshooting information created successfully.");
      return true;
    } catch {
      setMessage("Unable to connect to the server.");
      return false;
    }
  }

  async function handleTroubleshootingUpdate(
    troubleshootingId,
    problem,
    solution,
  ) {
    try {
      const response = await fetch(
        `/api/equipment/${equipment.id}/troubleshooting/${troubleshootingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            problem,
            solution,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return false;
      }

      setTroubleshooting((current) =>
        current.map((item) => (item.id === data.id ? data : item)),
      );

      setMessage("Troubleshooting information updated successfully.");
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

  function handleAuthModeChange(mode) {
    setAuthMode(mode);
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (authMode === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      const response = await fetch(
        authMode === "register" ? "/api/register" : "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      setUser(data.user);
      setMessage("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Unable to connect to the server.");
      setPassword("");
      setConfirmPassword("");
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
      setEquipment(null);
      setGuide(null);
      setEquipmentSearch("");
      setEquipmentCondition("");
      setEquipmentList([]);
      setTroubleshooting([]);
      setUnits([]);
      setPage("equipment");
      setMyLoans([]);
      setShowEquipmentForm(false);
      setShowEditEquipmentForm(false);
      setMessage("You have been logged out.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  async function handleShowMyLoans() {
    try {
      const response = await fetch("/api/loans/mine", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMyLoans(data);
      setPage("myLoans");
      setEquipment(null);
      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMessage("Unable to connect to the server.");
    }
  }

  function handleBackToEquipment() {
    setPage("equipment");
    setEquipment(null);
    setGuide(null);
    setUnits([]);
    setShowEditEquipmentForm(false);
    setMessage("");
  }

  const equipmentConditions = [
    ...new Set(equipmentList.map((item) => item.condition)),
  ].sort();

  const filteredEquipmentList = equipmentList.filter((item) => {
    const searchTerm = equipmentSearch.trim().toLowerCase();

    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.typeModel.toLowerCase().includes(searchTerm) ||
      (item.category ?? "").toLowerCase().includes(searchTerm);

    const matchesCondition =
      !equipmentCondition || item.condition === equipmentCondition;

    return matchesSearch && matchesCondition;
  });

  return (
    <>
      {message && (
        <div className="toast-message" role="status" aria-live="polite">
          {message}
        </div>
      )}

      {user ? (
        <div className="app-shell">
          <header className="app-header">
            <div className="header-content">
              <div className="brand">
                <FlaskConical size={24} />
                <span>LEKH</span>
              </div>

              <nav className="desktop-nav" aria-label="Main navigation">
                <button
                  className={
                    page === "equipment" ? "nav-link nav-active" : "nav-link"
                  }
                  type="button"
                  onClick={handleBackToEquipment}
                >
                  Equipment
                </button>

                {user.role === "STUDENT" && (
                  <button
                    className={
                      page === "myLoans" ? "nav-link nav-active" : "nav-link"
                    }
                    type="button"
                    onClick={handleShowMyLoans}
                  >
                    My loans
                  </button>
                )}
              </nav>

              <div className="user-actions desktop-user-actions">
                <span className="current-user">{user.username}</span>

                <button
                  className="logout-button"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>

              <button
                className="menu-button"
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {menuOpen && (
              <div className="mobile-menu">
                <div className="mobile-menu-content">
                  <div className="mobile-user">
                    <span className="mobile-user-label">Signed in as</span>
                    <strong>{user.username}</strong>
                  </div>

                  <button
                    className="mobile-nav-item"
                    type="button"
                    onClick={() => {
                      handleBackToEquipment();
                      setMenuOpen(false);
                    }}
                  >
                    Equipment
                  </button>

                  {user.role === "STUDENT" && (
                    <button
                      className="mobile-nav-item"
                      type="button"
                      onClick={() => {
                        handleShowMyLoans();
                        setMenuOpen(false);
                      }}
                    >
                      My loans
                    </button>
                  )}

                  <button
                    className="mobile-logout"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </header>

          <main className="app-content">
            {page === "myLoans" ? (
              <MyLoans loans={myLoans} />
            ) : equipment ? (
              <>
                <div className="equipment-navigation">
                  <button
                    className="back-button"
                    type="button"
                    onClick={handleBackToEquipment}
                  >
                    ← Back to equipment
                  </button>

                  {!showEditEquipmentForm &&
                    (user.role === "MAINTAINER" || user.role === "ADMIN") && (
                      <button
                        className="edit-equipment-button"
                        type="button"
                        onClick={() => setShowEditEquipmentForm(true)}
                      >
                        Edit equipment
                      </button>
                    )}
                </div>

                {showEditEquipmentForm ? (
                  <EquipmentForm
                    initialEquipment={equipment}
                    onSubmit={handleEquipmentUpdate}
                    onCancel={() => setShowEditEquipmentForm(false)}
                    title="Edit equipment"
                    submitLabel="Save changes"
                  />
                ) : (
                  <EquipmentDetails
                    equipment={equipment}
                    guide={guide}
                    troubleshooting={troubleshooting}
                    units={units}
                    user={user}
                    onLoanRequest={handleLoanRequest}
                    onGuideCreate={handleGuideCreate}
                    onGuideUpdate={handleGuideUpdate}
                    onTroubleshootingCreate={handleTroubleshootingCreate}
                    onTroubleshootingUpdate={handleTroubleshootingUpdate}
                    onUnitCreate={handleUnitCreate}
                    onUnitUpdate={handleUnitUpdate}
                  />
                )}
              </>
            ) : (
              <>
                <div className="section-heading">
                  <h1 className="page-title">Equipment</h1>

                  {(user.role === "MAINTAINER" || user.role === "ADMIN") && (
                    <button
                      type="button"
                      onClick={() => setShowEquipmentForm(true)}
                    >
                      Add equipment
                    </button>
                  )}
                </div>

                <p className="page-description">
                  Browse laboratory equipment and access equipment guides.
                </p>

                <div className="equipment-controls">
                  <div className="equipment-search">
                    <label htmlFor="equipment-search">Search equipment</label>
                    <input
                      id="equipment-search"
                      type="search"
                      value={equipmentSearch}
                      onChange={(event) =>
                        setEquipmentSearch(event.target.value)
                      }
                      placeholder="Search by name, model or category"
                    />
                  </div>

                  <div className="equipment-filter">
                    <label htmlFor="equipment-condition">Condition</label>
                    <select
                      id="equipment-condition"
                      value={equipmentCondition}
                      onChange={(event) =>
                        setEquipmentCondition(event.target.value)
                      }
                    >
                      <option value="">All conditions</option>
                      {equipmentConditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {showEquipmentForm && (
                  <EquipmentForm
                    onSubmit={handleEquipmentCreate}
                    onCancel={() => setShowEquipmentForm(false)}
                  />
                )}

                {filteredEquipmentList.length === 0 ? (
                  <p className="empty-state">
                    No equipment matches your search.
                  </p>
                ) : (
                  <div className="equipment-grid">
                    {filteredEquipmentList.map((item) => (
                      <button
                        className="equipment-card"
                        key={item.id}
                        type="button"
                        onClick={() => handleEquipmentSelect(item.id)}
                      >
                        <div className="equipment-card-header">
                          <div>
                            <p className="equipment-category">
                              {item.category}
                            </p>
                            <h2>{item.name}</h2>
                            <p>{item.typeModel}</p>
                          </div>

                          <span className="condition-badge">
                            {item.condition}
                          </span>
                        </div>

                        <div className="equipment-card-info">
                          <p>
                            <strong>Location</strong>
                            <span>{item.location}</span>
                          </p>

                          <p>
                            <strong>Availability</strong>
                            <span>
                              {item.availableQuantity} of {item.totalQuantity}{" "}
                              available
                            </span>
                          </p>
                        </div>

                        <span className="equipment-card-link">
                          View equipment →
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      ) : (
        <main className="login-page">
          <div className="login-container">
            <h1>LEKH</h1>
            <p className="login-subtitle">Lab Equipment Knowledge Hub</p>

            <div className="auth-switch">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => handleAuthModeChange("login")}
              >
                Log in
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => handleAuthModeChange("register")}
              >
                Create account
              </button>
            </div>

            <h2>{authMode === "register" ? "Create account" : "Login"}</h2>

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
                minLength={authMode === "register" ? 8 : undefined}
                required
              />

              {authMode === "register" && (
                <>
                  <label htmlFor="confirm-password">
                    <Lock size={18} />
                    Confirm password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={8}
                    required
                  />
                </>
              )}

              <button type="submit">
                {authMode === "register" ? (
                  <UserPlus size={18} />
                ) : (
                  <LogIn size={18} />
                )}
                {authMode === "register" ? "Create account" : "Log in"}
              </button>
            </form>
          </div>
        </main>
      )}
    </>
  );
}

export default App;
