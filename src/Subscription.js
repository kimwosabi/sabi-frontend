// src/Subscription.js
import React, { useState } from "react";
import API_BASE_URL from "./config";

export default function Subscription({ onSuccess }) {
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);
  const [message, setMessage] = useState("");

  const startPayment = async () => {
    if (!phone) return alert("Enter phone (2547...)");
    setLoading(true);
    setMessage("Requesting STK Push... you will get a prompt on your phone.");
    try {
      const res = await fetch(`${API_BASE_URL}/mpesa/stk_push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, tier })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || JSON.stringify(data));
      }
      setCheckoutId(data.checkout_request_id);
      setMessage("STK Push sent. Waiting for confirmation...");
      // poll status
      pollStatus(data.checkout_request_id);
    } catch (err) {
      setMessage("Error starting payment: " + err.message);
      setLoading(false);
    }
  };

  const pollStatus = async (checkout) => {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = 3000; // 3s
    const timer = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${API_BASE_URL}/mpesa/status?checkout_request_id=${encodeURIComponent(checkout)}`);
        const data = await res.json();
        if (data.status === "SUCCESS") {
          clearInterval(timer);
          setMessage("Payment successful! Subscription activated.");
          setLoading(false);
          if (onSuccess) onSuccess();
        } else if (data.status === "FAILED") {
          clearInterval(timer);
          setMessage("Payment failed: " + (data.mpesa_receipt || ""));
          setLoading(false);
        } else {
          setMessage("Waiting for payment confirmation...");
        }
        if (attempts >= maxAttempts) {
          clearInterval(timer);
          setMessage("Still pending. Check your phone or try again later.");
          setLoading(false);
        }
      } catch (e) {
        clearInterval(timer);
        setMessage("Error polling status: " + e.message);
        setLoading(false);
      }
    }, interval);
  };

  return (
    <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
      <h3>Subscribe to SABI Signals</h3>
      <div style={{ marginBottom: 10 }}>
        <label>Phone (format 2547...):</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="2547..." style={{ width: "100%", padding: 8, marginTop: 6 }} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Tier:</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }}>
          <option value="daily">Daily — KES 10</option>
          <option value="weekly">Weekly — KES 50</option>
          <option value="monthly">Monthly — KES 150</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={startPayment} disabled={loading} style={{ background: "#006b3c", color: "white", padding: "8px 12px", borderRadius: 6 }}>
          Pay with M-PESA
        </button>
      </div>
      {checkoutId && <p>Checkout ID: {checkoutId}</p>}
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
