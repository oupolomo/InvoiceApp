from fastapi import APIRouter
from app.schemas.invoice import Invoice
from app.db.database import get_connection
import json
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from pathlib import Path

router = APIRouter()
#
#    GET - retrieveing
#    POST = Creating
#    PATCH - Updating
#    PUT - Updating or ceatring new resource
#    Delete - delete
#
@router.get("/drop-all-tables")
def drop_all_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()

    for table in tables:
        name = table[0]
        if name != "sqlite_sequence":  # keep internal table
            cursor.execute(f"DROP TABLE IF EXISTS {name}")

    conn.commit()
    conn.close()

    return {"message": "All tables dropped"}
@router.post("/invoice")
def receive_invoice(invoice: Invoice):
    conn = get_connection()
    cursor = conn.cursor()

    lines_json = json.dumps([line.model_dump() for line in invoice.lines])

    cursor.execute("""
        INSERT INTO invoices (
            receiver,
            receiver_reg_nr,
            receiver_street,
            receiver_city,
            receiver_postalcode,
            receiver_country,
            receiver_email,
            receiver_phonenr,
            invoice_nr,
            comment,
            invoice_date,
            payment_term,
            lines_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        invoice.receiver,
        invoice.receiverRegNr,
        invoice.receiverStreet,
        invoice.receiverCity,
        invoice.receiverPostalcode,
        invoice.receiverCountry,
        invoice.receiverEmail,
        invoice.receiverPhonenr,
        invoice.invoiceNr,
        invoice.comment,
        invoice.invoiceDate,
        invoice.paymentTerm,
        lines_json
    ))

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    

    return {
        "message": "Invoice saved successfully",
        "id": new_id
    }
    
@router.get("/invoices")
def get_invoices():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, receiver, receiver_reg_nr, receiver_street, receiver_city,
        receiver_postalcode, receiver_country, receiver_email, receiver_phonenr,
        invoice_nr, comment, invoice_date, payment_term, lines_json
        FROM invoices
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    invoices = []

    for row in rows:
        invoices.append({
            "id": row["id"],
            "receiver": row["receiver"],
            "invoiceNr": row["invoice_nr"],
            "comment": row["comment"],
            "invoiceDate": row["invoice_date"],
            "paymentTerm": row["payment_term"],
            "lines": json.loads(row["lines_json"])
        })

    return invoices

@router.delete("/invoice/{invoice_id}")
def delete_invoice(invoice_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM invoices WHERE id = ?", (invoice_id,))
    conn.commit()
    conn.close()

    return {
        "message" : "Delete successful",
        "id" : invoice_id
    }
@router.get("/invoice/{invoice_id}/pdf")
def open_pdf_invoice(invoice_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, receiver, receiver_reg_nr, receiver_street, receiver_city,
               receiver_postalcode, receiver_country, receiver_email, receiver_phonenr,
               invoice_nr, comment, invoice_date, payment_term, lines_json
        FROM invoices
        WHERE id = ?
    """, (invoice_id,))

    row = cursor.fetchone()

    cursor.execute("""
        SELECT name, reg_nr, street, city, postalcode, country,
               phonenr, email, bank_name, bank_account_nr
        FROM company_settings
        WHERE id = 1
    """)

    company = cursor.fetchone()


    if row is None:
        return {"message": "Invoice not found"}
    if company is None:
        return {"message": "Company settings not set"}

    lines = json.loads(row["lines_json"])
    
    pdf_path = Path(f"invoice_{invoice_id}.pdf")

    c = canvas.Canvas(str(pdf_path))
    width, height = c._pagesize

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawRightString(width - 50, height - 50, f"ARVE {row['invoice_nr']}")

    #Top BLock
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 90, "Arve saaja")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 110, row["receiver"])
    c.drawString(50, height - 130, row["receiver_reg_nr"] or "")
    c.drawString(
        50,
        height - 150,
        f"{row['receiver_street']}, {row['receiver_city']}, {row['receiver_postalcode']}, {row['receiver_country']}"
    )
    c.drawString(50, height - 170, row["receiver_email"] or "")
    c.drawString(50, height - 190, row["receiver_phonenr"] or "")

    c.setFont("Helvetica", 12)
    c.drawRightString(width - 50, height - 100, f"Arve kuupäev: {row['invoice_date']}")
    c.drawRightString(width - 50, height - 120, f"Maksetähtaeg: {row['payment_term']} päeva")
    

    # Table header
    y = height - 230
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Kauba või teenuse nimetus")
    c.drawString(300, y, "Kogus")
    c.drawString(360, y, "Ühiku hind")
    c.drawString(440, y, "Maksumus kokku")

    # Line under header
    y -= 10
    c.line(50, y, 540, y)

    # Table rows
    c.setFont("Helvetica", 12)
    y -= 20

    grand_total = 0

    for line in lines:
        line_total = line["qty"] * line["price"]
        grand_total += line_total

        c.drawString(50, y, str(line["description"]))
        c.drawString(300, y, str(line["qty"]))
        c.drawString(360, y, f"{line['price']:.2f}")
        c.drawString(440, y, f"{line_total:.2f}")

        y -= 20

        if y < 100:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 12)

    # Total section
    y -= 20
    c.line(340, y, 540, y)
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(360, y, "Summa kokku:")
    c.drawString(470, y, f"{grand_total:.2f} EUR")

    #comment section
    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"{row['comment']}")

    # Content placed relative to current y, not page top
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Müüja andmed")

    y-= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, company["name"])

    y-= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, company["reg_nr"])

    y-= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"{company['street']},{company['city']}, {company['postalcode']},{company['country']}")

    y-= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, company["phonenr"])
    
    c.setFont("Helvetica", 12)
    c.drawRightString(width-50, y, company["bank_name"])    

    y-= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y, company["email"])

    c.setFont("Helvetica", 12)
    c.drawRightString(width-50, y, company["bank_account_nr"])  



    c.save()

    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=f"invoice_{invoice_id}.pdf"
    )
