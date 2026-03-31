import { useState } from "react";
import LoginScreen from "./LoginScreen";
import InvoiceTab from "./InvoiceTab";
import DatabaseTab from "./DatabaseTab";

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

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
        <button onClick={() => setActiveTab("invoice")}>Invoice maker</button>
        <button onClick={() => setActiveTab("database")}>Database</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {activeTab === "invoice" && <InvoiceTab />}
      {activeTab === "database" && <DatabaseTab />}
    </div>
  );
}

export default App;