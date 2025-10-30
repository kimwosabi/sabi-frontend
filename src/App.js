import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./AdminLogin";
import API_BASE_URL from "./config";

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("isAdmin"));
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({
    pair: "",
    direction: "",
    entry_price: "",
    take_profit: "",
    stop_loss: "",
    timestamp: "",
  });

  // ✅ Load signals
  const loadSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/signals`);
      const data = await res.json();
      setSignals(data.signals || []);
    } catch {
      toast.error("Failed to load signals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignals();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  // ✅ Submit a new signal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const signalData = {
      ...formData,
      signal_type: formData.direction === "LONG" ? "BUY" : "SELL",
      source: "Frontend",
      confidence: 0.9,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signalData),
      });
      if (!res.ok) throw new Error();
      toast.success("✅ Signal added successfully!");
      loadSignals();
      setFormData({
        pair: "",
        direction: "",
        entry_price: "",
        take_profit: "",
        stop_loss: "",
        timestamp: "",
      });
    } catch {
      toast.error("❌ Failed to add signal.");
    }
  };

  // ✅ Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      await res.json();
      window.localStorage.setItem("isAdmin", "true");
      setIsLoggedIn(true);
      toast.success("✅ Admin login successful!");
    } catch {
      toast.error("❌ Invalid admin credentials.");
    }
  };

  // ✅ Logout button
  const handleLogout = () => {
    window.localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdminMode(false);
    toast.info("✅ Logged out successfully!");
  };

  const showLogout = isLoggedIn && isAdminMode;

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
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* 🔴 Floating Logout Button */}
      {showLogout && (
        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          Logout
        </button>
      )}

      {/* ✅ Header */}
      <header
        style={{
          backgroundColor: "#006b3c",
          color: "white",
          padding: "20px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ margin: 0 }}>💹 SABI TECH Forex Signals</h1>
        <p style={{ margin: "6px 0 12px 0", opacity: 0.9 }}>
          Real-time Forex, Commodities & Indices trading insights.
        </p>
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          style={{
            background: "white",
            color: "#006b3c",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {isAdminMode ? "Switch to User Mode" : "Admin Mode"}
        </button>
      </header>

      {/* ✅ Admin Mode */}
      {isAdminMode ? (
        isLoggedIn ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#006b3c", marginBottom: "10px" }}>
              ➕ Add New Signal
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "15px",
              }}
            >
              <input name="pair" placeholder="Pair (e.g. EUR/USD)" value={formData.pair} onChange={handleChange} required style={inputStyle} />
              <select name="direction" value={formData.direction} onChange={handleChange} required style={inputStyle}>
                <option value="">Direction</option>
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
              <input type="number" step="0.0001" name="entry_price" placeholder="Entry" value={formData.entry_price} onChange={handleChange} required style={inputStyle} />
              <input type="number" step="0.0001" name="take_profit" placeholder="Take Profit" value={formData.take_profit} onChange={handleChange} required style={inputStyle} />
              <input type="number" step="0.0001" name="stop_loss" placeholder="Stop Loss" value={formData.stop_loss} onChange={handleChange} required style={inputStyle} />
              <input type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} required style={inputStyle} />
              <button type="submit" style={btnPrimary}>Add Signal</button>
            </form>
          </div>
        ) : (
          <div style={{ ...cardStyle, maxWidth: "400px", margin: "0 auto" }}>
            <h2 style={{ color: "#006b3c" }}>🔑 Admin Login</h2>
            <form onSubmit={handleAdminLogin} style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
              <input type="email" name="email" placeholder="Admin Email" value={loginData.email} onChange={handleLoginChange} required style={inputStyle} />
              <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required style={inputStyle} />
              <button type="submit" style={btnPrimary}>Login</button>
            </form>
          </div>
        )
      ) : null}

      {/* 📊 Signals Table */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#006b3c" }}>📊 Active Signals</h2>
          <button onClick={loadSignals} style={btnSecondary}>🔄 Refresh</button>
        </div>

        {loading ? (
          <p>Loading signals...</p>
        ) : signals.length === 0 ? (
          <p>No signals available yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                    <td style={{ color: signal.direction === "LONG" ? "green" : "red", fontWeight: "bold" }}>{signal.direction}</td>
                    <td>{signal.entry_price}</td>
                    <td>{signal.take_profit}</td>
                    <td>{signal.stop_loss}</td>
                    <td>{new Date(signal.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer style={{ marginTop: "40px", textAlign: "center", fontSize: "14px", color: "#006b3c", opacity: 0.8 }}>
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
  fontSize: "14px",
};
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  marginBottom: "25px",
};

export default App;
