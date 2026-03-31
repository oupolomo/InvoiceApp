import { useEffect, useState } from "react";

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
  const [lines, setLines] = useState([
    { description: "", qty: 1, price: 0 }
  ]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    loadCompanies();
    loadInvoiceSettings();
    loadServices();
  }, []);
  const loadInvoiceSettings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/invoicesettings");
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
      const response = await fetch("http://127.0.0.1:8000/clients");

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
      const response = await fetch("http://127.0.0.1:8000/services");

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

      const response = await fetch("http://127.0.0.1:8000/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(invoiceData)
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
      country: ""
    };

  function updateLine(index, field, value) {
    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  }

  function addLine() {
    setLines([...lines, { description: "", qty: 1, price: 0 }]);
  }

  const grandTotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);

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

    const response = await fetch("http://127.0.0.1:8000/invoicesettings", {
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

  return services.filter((service) =>
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
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "60px",
          alignItems: "flex-start"
        }}
      >
        <div>
          <p>arve saaja</p>

          <select
            value={invoiceReceiverChoice}
            onChange={(e) => setInvoiceReceiverChoice(e.target.value)}
            style={{ width: "220px", padding: "6px" }}
          >
            {companies.map((company) => (
              <option key={company.id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>

          <p>Reg. nr.</p>
          <p>{company.regNr}</p>

          <p>aadress</p>
          <p>
            {company.street || company.city || company.country
              ? `${company.street}, ${company.city}, ${company.country}`
              : ""}
          </p>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <p>arve number</p>
          <input
            value={invoiceNr}
            onChange={(e) => setInvoiceNr(e.target.value)}
          />

          <p>arve kuupäev</p>
          <input
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />

          <p>makse tingimus</p>
          <input
            value={paymentTerm}
            onChange={(e) => setPaymentTerm(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ marginTop: "80px" }}>
        <h3>Arve Koostamine</h3>
        <h4>Kommentaar</h4>
        <textarea
          rows={1}
          style={{ width: "600px", resize: "none", overflow: "hidden" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
            setComment(e.target.value)
          }}
        />
        <table style={{ width: "600px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {lines.map((line, index) => (
              <tr key={index}>
                <td
                  style={{
                    paddingBottom: "8px",
                    position: "relative",
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
                    style={{ width: "160px" }}
                  />

                  {activeSuggestionIndex === index &&
                    getMatchingServices(line.description).length > 0 && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "260px",
                          background: "white",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          zIndex: 1000,
                          maxHeight: "180px",
                          overflowY: "auto",
                        }}
                      >
                        {getMatchingServices(line.description).map((service) => (
                          <div
                            key={service.id}
                            onClick={() => selectServiceForLine(index, service)}
                            style={{
                              padding: "10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <div><strong>{service.name}</strong></div>
                            <div>{service.description}</div>
                            <div>{service.price} EUR</div>
                          </div>
                        ))}
                      </div>
                    )}
                </td>
                <td style={{ paddingBottom: "8px" }}>
                  <input
                    type="number"
                    value={line.qty}
                    onChange={(e) =>
                      updateLine(index, "qty", Number(e.target.value))
                    }
                    style={{ width: "60px" }}
                  />
                </td>

                <td style={{ paddingBottom: "8px" }}>
                  <input
                    type="number"
                    value={line.price}
                    onChange={(e) =>
                      updateLine(index, "price", Number(e.target.value))
                    }
                    style={{ width: "80px" }}
                  />
                </td>

                <td style={{ paddingBottom: "8px" }}>
                  {line.qty * line.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addLine}>Uus Rida</button>
        <button onClick={handleSaveInvoice}>Salvesta Arve</button>

        <div style={{ marginTop: "20px" }}>
          <strong>Grand total: {grandTotal}</strong>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTab;