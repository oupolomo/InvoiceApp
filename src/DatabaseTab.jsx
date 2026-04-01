import { useState } from "react";
import { apiFetch } from "./api";


function DatabaseTab() {
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = async () => {
    try {
      const response = await apiFetch(`/invoices`);
      const data = await response.json();

      console.log(data);
      setInvoices(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoices");
    }
  };

  const deleteInvoices = async (id) => {
    try {
      const response = await apiFetch(`/invoice/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log(data);

      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error(error);
      alert("delete failed");
    }
  };

const openInvoicePdf = async (id) => {
  try {
    const response = await apiFetch(`/invoice/${id}/pdf`);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error(error);
    alert("Failed to open PDF");
  }
};


  return (
    <div>
      <h2>Database</h2>

      <button onClick={loadInvoices}>
        Load invoices
      </button>

      <div style={{ marginTop: "20px" }}>
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <button onClick={() => deleteInvoices(invoice.id)}>
              Delete
            </button>
            <button onClick={() => openInvoicePdf(invoice.id)}>
              Save as PDF
            </button>

            <p><b>ID:</b> {invoice.id}</p>
            <p><b>Receiver:</b> {invoice.receiver}</p>
            <p><b>Invoice Nr:</b> {invoice.invoiceNr}</p>
            <p><b>Date:</b> {invoice.invoiceDate}</p>
            <p><b>Payment:</b> {invoice.paymentTerm}</p>

            <p><b>Lines:</b></p>

            {invoice.lines.map((line, i) => (
              <div key={i} style={{ marginLeft: "20px" }}>
                {line.description} | Qty: {line.qty} | Price: {line.price}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatabaseTab;