import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [formData, setFormData] = useState({
    pair: "",
    direction: "BUY",
    entry_price: "",
    stop_loss: "",
    take_profit: "",
    timestamp: "",
  });
  const [signals, setSignals] = useState([]);

  const API_URL = "http://127.0.0.1:8000"; // your backend URL

  // Fetch signals
  const fetchSignals = async () => {
    const res = await fetch(`${API_URL}/signals`);
    const data = await res.json();
    setSignals(data.signals || []);
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new signal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert("✅ Signal added successfully!");
      setFormData({
        pair: "",
        direction: "BUY",
        entry_price: "",
        stop_loss: "",
        take_profit: "",
        timestamp: "",
      });
      fetchSignals();
    } else {
      alert("❌ Failed to add signal");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>📈 Admin Panel - Add New Forex Signal</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input name="pair" placeholder="Pair (e.g., EUR/USD)" value={formData.pair} onChange={handleChange} required />
        <select name="direction" value={formData.direction} onChange={handleChange}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <input name="entry_price" placeholder="Entry Price" value={formData.entry_price} onChange={handleChange} required />
        <input name="stop_loss" placeholder="Stop Loss" value={formData.stop_loss} onChange={handleChange} required />
        <input name="take_profit" placeholder="Take Profit" value={formData.take_profit} onChange={handleChange} required />
        <input name="timestamp" type="datetime-local" value={formData.timestamp} onChange={handleChange} required />
        <button type="submit" style={{ padding: "10px", background: "green", color: "white", border: "none" }}>Add Signal</button>
      </form>

      <h3 style={{ marginTop: "30px" }}>📊 Existing Signals</h3>
      {signals.length === 0 ? (
        <p>No signals yet.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pair</th>
              <th>Direction</th>
              <th>Entry</th>
              <th>Stop Loss</th>
              <th>Take Profit</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.pair}</td>
                <td>{s.direction}</td>
                <td>{s.entry_price}</td>
                <td>{s.stop_loss}</td>
                <td>{s.take_profit}</td>
                <td>{new Date(s.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
