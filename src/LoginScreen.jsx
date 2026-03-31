import { useState } from "react";

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    localStorage.setItem("appPassword", password);
    onLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "320px",
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <p>Enter app password</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            background: "#7ea2ff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;