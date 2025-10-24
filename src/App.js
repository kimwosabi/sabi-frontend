import AdminLogin from "./AdminLogin";
import React, { useEffect, useState } from "react";
import API_BASE_URL from "./config";

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({
    pair: "",
    direction: "",
    entry_price: "",
    take_profit: "",
    stop_loss: "",
    timestamp: "",
  });

  const loadSignals = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/signals`)
      .then((res) => res.json())
      .then((data) => {
        setSignals(data.signals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadSignals();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const signalData = {
      ...formData,
      signal_type: formData.direction === "LONG" ? "BUY" : "SELL",
      source: "Frontend",
      confidence: 0.9,
    };

    fetch(`${API_BASE_URL}/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signalData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Signal added successfully!");
        loadSignals();
        setFormData({
          pair: "",
          direction: "",
          entry_price: "",
          take_profit: "",
          stop_loss: "",
          timestamp: "",
        });
      })
      .catch(() => alert("❌ Failed to add signal."));
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then(() => {
        alert("✅ Admin login successful!");
        window.localStorage.setItem("isAdmin", "true");
        setIsLoggedIn(true);
      })
      .catch(() => alert("❌ Invalid admin credentials."));
  };

  // ✅ Check if not admin (localStorage)
  if (!window.localStorage.getItem("isAdmin")) {
    return <AdminLogin onLogin={() => window.localStorage.setItem("isAdmin", "true")} />;
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Segoe UI, Arial",
        backgroundColor: "#f6fff6",
        color: "#033d0b",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          backgroundColor: "#006b3c",
          color: "white",
          padding: "15px 30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0 }}>💹 SABI TECH Forex Signals</h1>
        <p style={{ margin: "5px 0 10px 0", opacity: 0.9 }}>
          Real-time Forex, Commodities & Indices trading insights.
        </p>
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          style={{
            background: "white",
            color: "#006b3c",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {isAdminMode ? "Switch to User Mode" : "Admin Mode"}
        </button>
      </header>

      {isAdminMode ? (
        isLoggedIn ? (
          // ✅ Admin Logged In View
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              marginBottom: "25px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2 style={{ color: "#006b3c" }}>➕ Add New Signal (Admin)</h2>

  {isLoggedIn && (
    <button
      onClick={() => {
        window.localStorage.removeItem("isAdmin");
        setIsLoggedIn(false);
        setIsAdminMode(false);
      }}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  )}
</div>

<form
  onSubmit={handleSubmit}
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginTop: "15px",
  }}
>

            >
              <input
                name="pair"
                placeholder="Pair (e.g. EUR/USD)"
                value={formData.pair}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <select
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Direction</option>
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
              <input
                type="number"
                step="0.0001"
                name="entry_price"
                placeholder="Entry"
                value={formData.entry_price}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="number"
                step="0.0001"
                name="take_profit"
                placeholder="Take Profit"
                value={formData.take_profit}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="number"
                step="0.0001"
                name="stop_loss"
                placeholder="Stop Loss"
                value={formData.stop_loss}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="datetime-local"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button type="submit" style={btnPrimary}>
                Add Signal
              </button>
            </form>
          </div>
        ) : (
          // 🔒 Admin Login Form
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ color: "#006b3c" }}>🔑 Admin Login</h2>
            <form onSubmit={handleAdminLogin} style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                style={inputStyle}
              />
              <button type="submit" style={btnPrimary}>
                Login
              </button>
            </form>
          </div>
        )
      ) : null}

      {/* 📊 Signals Table */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#006b3c" }}>📊 Active Signals</h2>
          <button onClick={loadSignals} style={btnSecondary}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading signals...</p>
        ) : signals.length === 0 ? (
          <p>No signals available yet.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#006b3c", color: "white" }}>
                <th>Pair</th>
                <th>Direction</th>
                <th>Entry</th>
                <th>Take Profit</th>
                <th>Stop Loss</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, index) => (
                <tr key={index}>
                  <td>{signal.pair}</td>
                  <td
                    style={{
                      color: signal.direction === "LONG" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {signal.direction}
                  </td>
                  <td>{signal.entry_price}</td>
                  <td>{signal.take_profit}</td>
                  <td>{signal.stop_loss}</td>
                  <td>{new Date(signal.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "14px",
          color: "#006b3c",
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} SABI TECH Finance — Powered by Kimwosabi Signals
      </footer>
    </div>
  );
}

// --- Styles ---
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "100%",
};

const btnPrimary = {
  gridColumn: "span 2",
  backgroundColor: "#006b3c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "10px 20px",
  fontSize: "15px",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnSecondary = {
  backgroundColor: "#00a65a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "8px 14px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
  textAlign: "center",
};

export default App;
