import { useState } from "react";
import InvoiceTab from "./InvoiceTab";
import DatabaseTab from "./DatabaseTab";
import SettingsTab from "./SettingsTab";

function App() {
  const [activeTab, setActiveTab] = useState("invoice");

  return (
    <div style={{ padding: "100px", minHeight: "100vh", backgroundColor: "#e2e2e2", }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <button 
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",

            backgroundColor: "#78a3ff",
            color: "white",

            border: `none`,
            borderRadius: "10px",
            cursor: "pointer",

            marginRight: `40px`
          }}
        onClick={() => setActiveTab("invoice")}>Invoice maker</button>
        <button 
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",

            backgroundColor: "#78a3ff",
            color: "white",

            border: `none`,
            borderRadius: "10px",
            cursor: "pointer",

            marginRight: `40px`
          }}        
          onClick={() => setActiveTab("database")}>Database</button>
        <button 
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",

            backgroundColor: "#78a3ff",
            color: "white",

            border: `none`,
            borderRadius: "10px",
            cursor: "pointer",

            marginRight: `40px`
          }}        
        onClick={() => setActiveTab("settings")}>Setup</button>
      </div>
      <h1>Invoice Generating man</h1>

      <div style={{ marginTop: "30px" }}>
        {activeTab === "invoice" && <InvoiceTab />}
        {activeTab === "database" && <DatabaseTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

export default App;