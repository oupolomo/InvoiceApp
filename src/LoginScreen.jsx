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
        background:
          "radial-gradient(circle at 20% 20%, #dbeafe 0%, transparent 40%), radial-gradient(circle at 80% 80%, #e0e7ff 0%, transparent 40%), linear-gradient(135deg, #f0f4ff 0%, #f8fbff 100%)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "40px 32px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {/* Logo / Title */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
              color: "#1e293b",
            }}
          >
            Invoice App
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Secure access required
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: "18px" }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              outline: "none",
              fontSize: "14px",
              background: "rgba(255,255,255,0.9)",
              transition: "all 0.2s ease",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid #7ea2ff";
              e.target.style.boxShadow =
                "0 0 0 3px rgba(126,162,255,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #e2e8f0";
              e.target.style.boxShadow =
                "inset 0 1px 2px rgba(0,0,0,0.05)";
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "600",
            fontSize: "15px",
            color: "white",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #7ea2ff 0%, #6366f1 100%)",
            boxShadow:
              "0 10px 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "all 0.15s ease",
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          Unlock
        </button>

        {/* Footer */}
        <p
          style={{
            marginTop: "18px",
            fontSize: "12px",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          Protected access
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;