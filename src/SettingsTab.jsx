import { useEffect, useState } from "react";
import { apiFetch } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

const cardStyle = {
  width: "260px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
};

function SettingsTab() {
  const [openModal, setOpenModal] = useState(null);

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "1000px",
    maxWidth: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  };

  const [companyData, setCompanyData] = useState({
    name: "MyAmazingCompany OU",
    regNr: "11244334",
    street: "Amazing tn 11-22",
    city: "Examplista",
    postalcode: "12345",
    country: "Contrista",
    phonenr: "51234567",
    email: "myamazing@example.com",
    bankName: "AS EXMP Bank",
    bankAccountNr: "EE123456789012345678",
  });

  const [invoiceSettingsData, setInvoiceSettingsData] = useState({
    invoiceNr: "0100",
    paymentTerm: "20",
  });

  const saveInvoiceSettingsData = async () => {
    try {
      const response = await apiapiFetch(`${API_URL}/invoicesettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceSettingsData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert("Invoice settings saved");
    } catch (error) {
      console.error(error);
      alert("Failed to save invoice settings");
    }
  };

  const loadInvoiceSettingsData = async () => {
    try {
      const response = await apiFetch(`${API_URL}/invoicesettings`);
      const data = await response.json();

      console.log(data);
      setInvoiceSettingsData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoice settings");
    }
  };

  const loadCompanySettings = async () => {
    try {
      const response = await apiFetch(`${API_URL}/companysettings`);
      const data = await response.json();

      console.log(data);
      setCompanyData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load company settings");
    }
  };

  const saveCompanySettings = async () => {
    try {
      const response = await apiFetch(`${API_URL}/companysettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert("Company settings saved");
    } catch (error) {
      console.error(error);
      alert("Failed to save company settings");
    }
  };

  useEffect(() => {
    loadCompanySettings();
    loadInvoiceSettingsData();
  }, []);

  return (
    <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
      <div style={cardStyle}>
        <h3>My company</h3>
        <p>Edit my company info</p>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#6a99ff",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginLeft: "170px",
            marginTop: "20px",
          }}
          onClick={() => setOpenModal("company")}
        >
          EDIT
        </button>
      </div>

      <div style={cardStyle}>
        <h3>Clients</h3>
        <p>Edit clients info</p>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#6a99ff",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginLeft: "170px",
            marginTop: "20px",
          }}
          onClick={() => setOpenModal("clients")}
        >
          EDIT
        </button>
      </div>

      <div style={cardStyle}>
        <h3>Services</h3>
        <p>Edit services info</p>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#6a99ff",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginLeft: "170px",
            marginTop: "20px",
          }}
          onClick={() => setOpenModal("services")}
        >
          EDIT
        </button>
      </div>

      <div style={cardStyle}>
        <h3>Arve seaded</h3>
        <p>Arve nr, Makse ting, ...</p>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#6a99ff",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginLeft: "170px",
            marginTop: "20px",
          }}
          onClick={() => setOpenModal("invoiceSettings")}
        >
          EDIT
        </button>
      </div>

      {openModal && (
        <div style={overlayStyle} onClick={() => setOpenModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {openModal === "company" && (
              <CompanyTab
                companyData={companyData}
                setCompanyData={setCompanyData}
                saveCompanySettings={saveCompanySettings}
              />
            )}
            {openModal === "clients" && <ClientsTab />}
            {openModal === "services" && <ServicesTab />}
            {openModal === "invoiceSettings" && (
              <InvoiceSettingsTab
                invoiceSettingsData={invoiceSettingsData}
                setInvoiceSettingsData={setInvoiceSettingsData}
                saveInvoiceSettingsData={saveInvoiceSettingsData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyTab({ companyData, setCompanyData, saveCompanySettings }) {
  return (
    <div>
      <p>Company name</p>
      <input
        value={companyData.name}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            name: e.target.value,
          })
        }
      />

      <p>Registry number</p>
      <input
        value={companyData.regNr}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            regNr: e.target.value,
          })
        }
      />

      <p>Street</p>
      <input
        value={companyData.street}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            street: e.target.value,
          })
        }
      />

      <p>Postal Code</p>
      <input
        value={companyData.postalcode}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            postalcode: e.target.value,
          })
        }
      />

      <p>City</p>
      <input
        value={companyData.city}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            city: e.target.value,
          })
        }
      />

      <p>Country</p>
      <input
        value={companyData.country}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            country: e.target.value,
          })
        }
      />

      <p>Phone</p>
      <input
        value={companyData.phonenr}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            phonenr: e.target.value,
          })
        }
      />

      <p>E-Mail</p>
      <input
        value={companyData.email}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            email: e.target.value,
          })
        }
      />

      <p>Bank Name</p>
      <input
        value={companyData.bankName}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            bankName: e.target.value,
          })
        }
      />

      <p>Bank Account Nr</p>
      <input
        value={companyData.bankAccountNr}
        onChange={(e) =>
          setCompanyData({
            ...companyData,
            bankAccountNr: e.target.value,
          })
        }
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={saveCompanySettings}>
          Save Company Settings
        </button>
      </div>
    </div>
  );
}

function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);

  const innerOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  };

  const innerModalStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "500px",
    maxWidth: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  };

  const loadClients = async () => {
    try {
      const response = await apiFetch(`${API_URL}/clients`);

      console.log("clients response status:", response.status);

      const text = await response.text();
      console.log("clients raw response:", text);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${text}`);
      }

      const data = JSON.parse(text);
      console.log("clients parsed data:", data);

      setClients(data);
    } catch (error) {
      console.error("loadClients failed:", error);
      alert(`Failed to load clients: ${error.message}`);
    }
  };

  const addClient = async () => {
    const newClient = {
      name: "New Client",
      regNr: "",
      street: "",
      city: "",
      postalcode: "",
      country: "",
      phonenr: "",
      email: "",
      bankName: "",
      bankAccountNr: "",
    };

    try {
      const response = await apiFetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await loadClients();
    } catch (error) {
      console.error(error);
      alert("Failed to add client");
    }
  };

  const saveEditedClient = async () => {
    try {
      const response = await apiFetch(`${API_URL}/clients/${editingClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingClient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await loadClients();
      setEditingClient(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save client");
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await apiFetch(`${API_URL}/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await loadClients();

      if (editingClient && editingClient.id === id) {
        setEditingClient(null);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete client");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div>
      <h2>Kliendid</h2>
      <button onClick={addClient}>Lisa klient</button>
      <hr style={{ border: "2px solid #000000", margin: "20px 0" }} />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {clients.map((client) => (
          <div
            key={client.id}
            style={{
              width: "260px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h3>{client.name}</h3>
            <p>Registrikood: {client.regNr || "-"}</p>
            <p>Tänav: {client.street || "-"}</p>
            <p>Linn: {client.city || "-"}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => setEditingClient(client)}>
                Edit client
              </button>
              <button onClick={() => deleteClient(client.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingClient && (
        <div style={innerOverlayStyle} onClick={() => setEditingClient(null)}>
          <div style={innerModalStyle} onClick={(e) => e.stopPropagation()}>
            <h3>Edit client</h3>

            <p>Client name</p>
            <input
              value={editingClient.name}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  name: e.target.value,
                })
              }
            />

            <p>Registry number</p>
            <input
              value={editingClient.regNr}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  regNr: e.target.value,
                })
              }
            />

            <p>Street</p>
            <input
              value={editingClient.street}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  street: e.target.value,
                })
              }
            />

            <p>City</p>
            <input
              value={editingClient.city}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  city: e.target.value,
                })
              }
            />

            <p>Postal code</p>
            <input
              value={editingClient.postalcode}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  postalcode: e.target.value,
                })
              }
            />

            <p>Country</p>
            <input
              value={editingClient.country}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  country: e.target.value,
                })
              }
            />

            <p>Phone</p>
            <input
              value={editingClient.phonenr}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  phonenr: e.target.value,
                })
              }
            />

            <p>Email</p>
            <input
              value={editingClient.email}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  email: e.target.value,
                })
              }
            />

            <p>Bank name</p>
            <input
              value={editingClient.bankName}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  bankName: e.target.value,
                })
              }
            />

            <p>Bank account nr</p>
            <input
              value={editingClient.bankAccountNr}
              onChange={(e) =>
                setEditingClient({
                  ...editingClient,
                  bankAccountNr: e.target.value,
                })
              }
            />

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={saveEditedClient}>Save</button>
              <button onClick={() => deleteClient(editingClient.id)}>
                Delete
              </button>
              <button onClick={() => setEditingClient(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceSettingsTab({
  invoiceSettingsData,
  setInvoiceSettingsData,
  saveInvoiceSettingsData,
}) {
  return (
    <div>
      <p>Järgmise arve number</p>
      <input
        value={invoiceSettingsData.invoiceNr}
        onChange={(e) =>
          setInvoiceSettingsData({
            ...invoiceSettingsData,
            invoiceNr: e.target.value,
          })
        }
      />
      <button onClick={saveInvoiceSettingsData}>Save</button>
    </div>
  );
}

function ServicesTab() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
  });

  const loadServices = async () => {
    const response = await apiFetch(`${API_URL}/services`);
    const data = await response.json();
    setServices(data);
  };

  const addService = async () => {
    const response = await apiFetch(`${API_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    });

    if (!response.ok) {
      alert("Failed to add service");
      return;
    }

    setNewService({
      name: "",
      description: "",
      price: 0,
    });

    loadServices();
  };

  useEffect(() => {
    loadServices();
  }, []);

  const deleteService = async (id) => {
    try {
      const response = await apiFetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await loadServices();
    } catch (error) {
      console.error(error);
      alert("Failed to delete service");
    }
  };

  return (
    <div>
      <h2>Services</h2>

      <p>Name</p>
      <input
        value={newService.name}
        onChange={(e) =>
          setNewService({ ...newService, name: e.target.value })
        }
      />

      <p>Description</p>
      <input
        value={newService.description}
        onChange={(e) =>
          setNewService({ ...newService, description: e.target.value })
        }
      />

      <p>Price</p>
      <input
        type="number"
        value={newService.price}
        onChange={(e) =>
          setNewService({ ...newService, price: Number(e.target.value) })
        }
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={addService}>Add service</button>
      </div>

      <hr />

      {services.map((service) => (
        <div
          key={service.id}
          style={{
            width: "260px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            marginBottom: "12px",
          }}
        >
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <p>{service.price} EUR</p>

          <button onClick={() => deleteService(service.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default SettingsTab;