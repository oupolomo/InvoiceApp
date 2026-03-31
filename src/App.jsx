import { useState } from "react";
import InvoiceTab from "./InvoiceTab";
import DatabaseTab from "./DatabaseTab";
import SettingsTab from "./SettingsTab";
import LoginScreen from "./LoginScreen";

function App() {
  const [activeTab, setActiveTab] = useState("invoice");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("appPassword"));

  const handleLogout = () => {
    localStorage.removeItem("appPassword");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const tabButtonStyle = (tabName) => ({
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "Inter, Arial, sans-serif",
    background:
      activeTab === tabName
        ? "linear-gradient(135deg, #7ea2ff 0%, #6366f1 100%)"
        : "rgba(255,255,255,0.72)",
    color: activeTab === tabName ? "white" : "#334155",
    border: activeTab === tabName
      ? "1px solid rgba(255,255,255,0.15)"
      : "1px solid rgba(148,163,184,0.18)",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow:
      activeTab === tabName
        ? "0 12px 24px rgba(99,102,241,0.22), inset 0 1px 0 rgba(255,255,255,0.22)"
        : "0 8px 20px rgba(15,23,42,0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.18s ease",
  });

  const smallButtonStyle = {
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "Inter, Arial, sans-serif",
    background: "rgba(255,255,255,0.72)",
    color: "#334155",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.18s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "radial-gradient(circle at 15% 20%, #dbeafe 0%, transparent 28%), radial-gradient(circle at 85% 15%, #e9d5ff 0%, transparent 24%), radial-gradient(circle at 80% 80%, #bfdbfe 0%, transparent 30%), linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.58)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "28px",
            padding: "24px 24px 18px 24px",
            boxShadow:
              "0 24px 60px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.45)",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#6366f1",
                  marginBottom: "10px",
                }}
              >
                Secure workspace
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "42px",
                  lineHeight: "1",
                  letterSpacing: "-1.4px",
                  color: "#0f172a",
                }}
              >
                Invoice Studio
              </h1>

              <p
                style={{
                  margin: "12px 0 0 0",
                  color: "#64748b",
                  fontSize: "16px",
                  maxWidth: "680px",
                }}
              >
                Create invoices, browse saved records, and manage settings in one polished dashboard.
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={smallButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 14px 28px rgba(15,23,42,0.10)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
              }}
            >
              Logout
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={tabButtonStyle("invoice")}
              onClick={() => setActiveTab("invoice")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
            >
              Invoice maker
            </button>

            <button
              style={tabButtonStyle("database")}
              onClick={() => setActiveTab("database")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
            >
              Database
            </button>

            <button
              style={tabButtonStyle("settings")}
              onClick={() => setActiveTab("settings")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
            >
              Setup
            </button>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.42)",
            borderRadius: "28px",
            padding: "28px",
            boxShadow:
              "0 24px 60px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {activeTab === "invoice" && <InvoiceTab />}
          {activeTab === "database" && <DatabaseTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

export default App;