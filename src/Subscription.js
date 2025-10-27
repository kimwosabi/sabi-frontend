import React, { useState } from "react";
import API_BASE_URL from "./config";

function Subscription({ onSuccess }) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(300);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!phone.startsWith("254")) {
      alert("Please enter your number in 2547XXXXXXXX format");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/mpesa/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, amount }),
      });

      const data = await res.json();
      if (data.ResponseCode === "0") {
        alert("✅ STK Push sent! Enter your M-PESA PIN to complete payment.");
        onSuccess();
      } else {
        alert("❌ Payment failed. Please try again.");
        console.log("M-PESA Response:", data);
      }
    } catch (err) {
      alert("Error connecting to payment gateway");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "40px",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#006b3c" }}>💳 Subscribe via M-PESA</h2>
      <p>Get full access to all premium forex signals.</p>

      <input
        type="text"
        placeholder="Phone Number (2547XXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />
      <br />
      <select
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      >
        <option value={300}>Daily - KSh 300</option>
        <option value={1500}>Weekly - KSh 1500</option>
        <option value={4000}>Monthly - KSh 4000</option>
      </select>
      <br />
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          background: "#006b3c",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default Subscription;
