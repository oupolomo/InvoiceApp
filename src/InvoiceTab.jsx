import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function InvoiceTab() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("et-EE");
  const [services, setServices] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [invoiceReceiverChoice, setInvoiceReceiverChoice] = useState("");
  const [invoiceNr, setInvoiceNr] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(formattedDate);
  const [paymentTerm, setPaymentTerm] = useState(20);
  const [lines, setLines] = useState([{ description: "", qty: 1, price: 0 }]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadCompanies();
    loadInvoiceSettings();
    loadServices();
  }, []);

  const loadInvoiceSettings = async () => {
    try {
      const response = await apiFetch(`/invoicesettings`);
      const data = await response.json();

      console.log("invoice settings:", data);
      setInvoiceNr(data.invoiceNr || "puudub");
    } catch (error) {
      console.error(error);
      setInvoiceNr("puudub");
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await apiFetch(`/clients`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setCompanies(data);

      if (data.length > 0) {
        setInvoiceReceiverChoice(data[0].name);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load companies");
    }
  };

  const loadServices = async () => {
    try {
      const response = await apiFetch(`/services`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load services");
    }
  };

  const saveInvoice = async () => {
    try {
      const invoiceData = {
        receiver: invoiceReceiverChoice,
        receiverRegNr: company.regNr,
        receiverStreet: company.street,
        receiverCity: company.city,
        receiverPostalcode: company.postalcode,
        receiverCountry: company.country,
        receiverEmail: company.email,
        receiverPhonenr: company.phonenr,
        invoiceNr,
        comment,
        invoiceDate,
        paymentTerm,
        lines,
      };

      const response = await apiFetch(`/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("saving failed");
    }
  };

  const company =
    companies.find((company) => company.name === invoiceReceiverChoice) || {
      regNr: "",
      street: "",
      city: "",
      postalcode: "",
      country: "",
      email: "",
      phonenr: "",
    };

  function updateLine(index, field, value) {
    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  }

  function addLine() {
    setLines([...lines, { description: "", qty: 1, price: 0 }]);
  }

  const grandTotal = lines.reduce(
    (sum, line) => sum + line.qty * line.price,
    0
  );

  const handleSaveInvoice = async () => {
    try {
      console.log("1. Starting save");

      const currentNr = invoiceNr || "0";
      console.log("2. currentNr:", currentNr);

      const parsedNr = parseInt(currentNr, 10);

      if (isNaN(parsedNr)) {
        throw new Error(`Invoice number is not numeric: ${currentNr}`);
      }

      await saveInvoice();
      console.log("3. Invoice itself saved");

      const nextNr = String(parsedNr + 1).padStart(currentNr.length, "0");
      console.log("4. nextNr:", nextNr);

      const updatedInvoiceSettings = {
        invoiceNr: nextNr,
        paymentTerm: String(paymentTerm),
      };
      console.log("5. updatedInvoiceSettings:", updatedInvoiceSettings);

      const response = await apiFetch(`/invoicesettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInvoiceSettings),
      });

      console.log("6. PUT response status:", response.status);

      const responseText = await response.text();
      console.log("7. PUT response text:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${responseText}`);
      }

      setInvoiceNr(nextNr);

      alert("Arve salvestatud");
    } catch (error) {
      console.error("handleSaveInvoice failed:", error);
      alert("Arve või arve numbri salvestamine ebaõnnestus: " + error.message);
    }
  };

  function getMatchingServices(searchText) {
    if (!searchText.trim()) return [];

    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  function selectServiceForLine(index, service) {
    const newLines = [...lines];
    newLines[index].description = service.description;
    newLines[index].price = service.price;

    if (!newLines[index].qty || newLines[index].qty <= 0) {
      newLines[index].qty = 1;
    }

    setLines(newLines);
    setActiveSuggestionIndex(null);
  }

  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveSuggestionIndex(null);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const sectionTitleStyle = {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.4px",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.46)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0 18px 40px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.35)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #dbe3f0",
    background: "rgba(255,255,255,0.92)",
    boxSizing: "border-box",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
  };

  const smallInputStyle = {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #dbe3f0",
    background: "rgba(255,255,255,0.92)",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
  };

  const primaryButtonStyle = {
    padding: "14px 20px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #7ea2ff 0%, #6366f1 100%)",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 12px 24px rgba(99,102,241,0.24), inset 0 1px 0 rgba(255,255,255,0.2)",
  };

  const secondaryButtonStyle = {
    padding: "14px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(255,255,255,0.75)",
    color: "#334155",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15,23,42,0.05)",
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "24px",
          alignItems: "stretch",
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
            }}
          >
            <h2 style={sectionTitleStyle}>Arve saaja</h2>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#6366f1",
                background: "rgba(99,102,241,0.08)",
                padding: "8px 12px",
                borderRadius: "999px",
              }}
            >

            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={labelStyle}>Ettevõte</div>
            <select
              value={invoiceReceiverChoice}
              onChange={(e) => setInvoiceReceiverChoice(e.target.value)}
              style={inputStyle}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div>
              <div style={labelStyle}>Reg. nr.</div>
              <div
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  minHeight: "52px",
                }}
              >
                {company.regNr}
              </div>
            </div>

            <div>
              <div style={labelStyle}>Email</div>
              <div
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  minHeight: "52px",
                }}
              >
                {company.email}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <div style={labelStyle}>Aadress</div>
            <div
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                minHeight: "52px",
              }}
            >
              {company.street || company.city || company.country
                ? `${company.street}, ${company.city}, ${company.country}`
                : ""}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
            }}
          >
            <h2 style={sectionTitleStyle}>Arve andmed</h2>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#0f766e",
                background: "rgba(13,148,136,0.08)",
                padding: "8px 12px",
                borderRadius: "999px",
              }}
            >

            </div>
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <div style={labelStyle}>Arve number</div>
              <input
                value={invoiceNr}
                onChange={(e) => setInvoiceNr(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>Arve kuupäev</div>
              <input
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>Maksetingimus</div>
              <input
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2 style={sectionTitleStyle}>Arve koostamine</h2>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Lisa read, vali teenused ja salvesta valmis arve.
            </p>
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
              border: "1px solid rgba(99,102,241,0.12)",
              minWidth: "180px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#64748b",
                fontWeight: "700",
              }}
            >
              Grand total
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#0f172a",
                marginTop: "4px",
                letterSpacing: "-0.6px",
              }}
            >
              {grandTotal} €
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "22px" }}>
          <div style={labelStyle}>Kommentaar</div>
          <textarea
            rows={1}
            style={{
              ...inputStyle,
              minHeight: "56px",
              resize: "none",
              overflow: "hidden",
              fontFamily: "inherit",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
              setComment(e.target.value);
            }}
          />
        </div>

        <div
          style={{
            overflowX: "auto",
            borderRadius: "18px",
            border: "1px solid rgba(226,232,240,0.95)",
            background: "rgba(255,255,255,0.72)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              minWidth: "760px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#64748b",
                    borderBottom: "1px solid #e2e8f0",
                    background: "rgba(248,250,252,0.95)",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#64748b",
                    borderBottom: "1px solid #e2e8f0",
                    background: "rgba(248,250,252,0.95)",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#64748b",
                    borderBottom: "1px solid #e2e8f0",
                    background: "rgba(248,250,252,0.95)",
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#64748b",
                    borderBottom: "1px solid #e2e8f0",
                    background: "rgba(248,250,252,0.95)",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {lines.map((line, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "14px 16px",
                      position: "relative",
                      borderBottom: "1px solid #eef2f7",
                      verticalAlign: "top",
                    }}
                  >
                    <input
                      value={line.description}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSuggestionIndex(index);
                      }}
                      onChange={(e) => {
                        updateLine(index, "description", e.target.value);
                        setActiveSuggestionIndex(index);
                      }}
                      style={{
                        ...smallInputStyle,
                        width: "100%",
                        minWidth: "260px",
                      }}
                    />

                    {activeSuggestionIndex === index &&
                      getMatchingServices(line.description).length > 0 && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            top: "calc(100% - 6px)",
                            left: "16px",
                            width: "340px",
                            background: "rgba(255,255,255,0.97)",
                            border: "1px solid #dbe3f0",
                            borderRadius: "16px",
                            boxShadow: "0 18px 40px rgba(15,23,42,0.14)",
                            zIndex: 1000,
                            maxHeight: "220px",
                            overflowY: "auto",
                            backdropFilter: "blur(14px)",
                            WebkitBackdropFilter: "blur(14px)",
                          }}
                        >
                          {getMatchingServices(line.description).map((service) => (
                            <div
                              key={service.id}
                              onClick={() => selectServiceForLine(index, service)}
                              style={{
                                padding: "14px 16px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eef2f7",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "700",
                                  color: "#0f172a",
                                  marginBottom: "4px",
                                }}
                              >
                                {service.name}
                              </div>
                              <div
                                style={{
                                  color: "#475569",
                                  fontSize: "14px",
                                  marginBottom: "4px",
                                }}
                              >
                                {service.description}
                              </div>
                              <div
                                style={{
                                  color: "#6366f1",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                }}
                              >
                                {service.price} EUR
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </td>

                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #eef2f7",
                      verticalAlign: "top",
                    }}
                  >
                    <input
                      type="number"
                      value={line.qty}
                      onChange={(e) =>
                        updateLine(index, "qty", Number(e.target.value))
                      }
                      style={{
                        ...smallInputStyle,
                        width: "90px",
                      }}
                    />
                  </td>

                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #eef2f7",
                      verticalAlign: "top",
                    }}
                  >
                    <input
                      type="number"
                      value={line.price}
                      onChange={(e) =>
                        updateLine(index, "price", Number(e.target.value))
                      }
                      style={{
                        ...smallInputStyle,
                        width: "120px",
                      }}
                    />
                  </td>

                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #eef2f7",
                      verticalAlign: "middle",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {line.qty * line.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            marginTop: "22px",
            flexWrap: "wrap",
          }}
        >
          <button onClick={addLine} style={secondaryButtonStyle}>
            Uus rida
          </button>
          <button onClick={handleSaveInvoice} style={primaryButtonStyle}>
            Salvesta arve
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTab;