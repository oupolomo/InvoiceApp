import { useState } from "react";
import { apiFetch } from "./api";

const ESTONIAN_MONTHS = [
  "Jaanuar",
  "Veebruar",
  "Märts",
  "Aprill",
  "Mai",
  "Juuni",
  "Juuli",
  "August",
  "September",
  "Oktoober",
  "November",
  "Detsember",
];

const getInvoiceFilename = (invoice) => {
  const date = String(invoice.invoiceDate || "").trim();
  const estonianDate = date.match(/^\d{1,2}\.(\d{1,2})\.(\d{4})$/);
  const isoDate = date.match(/^(\d{4})-(\d{1,2})-\d{1,2}$/);
  const month = Number(estonianDate?.[1] || isoDate?.[2]);
  const year = estonianDate?.[2] || isoDate?.[1] || "aastata";
  const monthName = ESTONIAN_MONTHS[month - 1] || "Kuupäevata";
  const invoiceNr = String(invoice.invoiceNr || "").padStart(4, "0");

  const filename = `${invoiceNr} ${invoice.receiver} ${monthName} ${year}`;

  // Remove characters Windows does not allow in filenames, while keeping spaces and Estonian letters.
  return `${filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").replace(/\s+/g, " ").trim()}.pdf`;
};


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

const downloadInvoicePdf = async (invoice) => {
  try {
    const response = await apiFetch(`/invoice/${invoice.id}/pdf`);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = getInvoiceFilename(invoice);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
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
            <button onClick={() => downloadInvoicePdf(invoice)}>
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
