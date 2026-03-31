from fastapi import APIRouter
from app.db.database import get_connection
from app.schemas.settings import CompanySettings, Client, InvoiceSettings, Service

router = APIRouter()


@router.get("/invoicesettings")
def get_invoice_settings():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT invoice_nr, payment_term
        FROM invoice_settings
        WHERE id = 1
    """)

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return {
            "invoiceNr": "",
            "paymentTerm": ""
        }

    return {
        "invoiceNr": row["invoice_nr"],
        "paymentTerm": row["payment_term"]
    }

@router.get("/services")
def get_services():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, description, price
        FROM services
        ORDER BY name ASC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "price": row["price"]
        }
        for row in rows
    ]


@router.post("/services")
def create_service(service: Service):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO services (name, description, price)
        VALUES (?, ?, ?)
    """, (
        service.name,
        service.description,
        service.price
    ))

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return {
        "message": "Service created successfully",
        "id": new_id
    }


@router.put("/services/{service_id}")
def update_service(service_id: int, service: Service):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE services
        SET name = ?, description = ?, price = ?
        WHERE id = ?
    """, (
        service.name,
        service.description,
        service.price,
        service_id
    ))

    conn.commit()
    conn.close()

    return {"message": "Service updated successfully"}


@router.delete("/services/{service_id}")
def delete_service(service_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM services WHERE id = ?", (service_id,))

    conn.commit()
    conn.close()

    return {"message": "Service deleted successfully"}
@router.put("/invoicesettings")
def save_invoice_settings(settings: InvoiceSettings):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO invoice_settings (
            id, invoice_nr, payment_term
        )
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            invoice_nr = excluded.invoice_nr,
            payment_term = excluded.payment_term
    """, (
        1,
        settings.invoiceNr,
        settings.paymentTerm
    ))

    conn.commit()
    conn.close()

    return {
        "message": "Invoice settings saved successfully"
    }

@router.get("/clients")
def get_clients():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, regNr, street, city, postalcode, country,
               phonenr, email, bankName, bankAccountNr
        FROM clients
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row["id"],
            "name": row["name"],
            "regNr": row["regNr"],
            "street": row["street"],
            "city": row["city"],
            "postalcode": row["postalcode"],
            "country": row["country"],
            "phonenr": row["phonenr"],
            "email": row["email"],
            "bankName": row["bankName"],
            "bankAccountNr": row["bankAccountNr"]
        }
        for row in rows
    ]


@router.post("/clients")
def create_client(client: Client):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO clients (
            name, regNr, street, city, postalcode, country,
            phonenr, email, bankName, bankAccountNr
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        client.name,
        client.regNr,
        client.street,
        client.city,
        client.postalcode,
        client.country,
        client.phonenr,
        client.email,
        client.bankName,
        client.bankAccountNr
    ))

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return {
        "message": "Client created successfully",
        "id": new_id
    }


@router.put("/clients/{client_id}")
def update_client(client_id: int, client: Client):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE clients
        SET name = ?,
            regNr = ?,
            street = ?,
            city = ?,
            postalcode = ?,
            country = ?,
            phonenr = ?,
            email = ?,
            bankName = ?,
            bankAccountNr = ?
        WHERE id = ?
    """, (
        client.name,
        client.regNr,
        client.street,
        client.city,
        client.postalcode,
        client.country,
        client.phonenr,
        client.email,
        client.bankName,
        client.bankAccountNr,
        client_id
    ))

    conn.commit()
    conn.close()

    return {
        "message": "Client updated successfully"
    }


@router.delete("/clients/{client_id}")
def delete_client(client_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM clients WHERE id = ?", (client_id,))

    conn.commit()
    conn.close()

    return {
        "message": "Client deleted successfully"
    }


@router.get("/companysettings")
def get_company_settings():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name, reg_nr, street, city, postalcode, country,
               phonenr, email, bank_name, bank_account_nr
        FROM company_settings
        WHERE id = 1
    """)

    row = cursor.fetchone()
    conn.close()

    if row is None:
        return {
            "name": "",
            "regNr": "",
            "street": "",
            "city": "",
            "postalcode": "",
            "country": "",
            "phonenr": "",
            "email": "",
            "bankName": "",
            "bankAccountNr": ""
        }

    return {
        "name": row["name"],
        "regNr": row["reg_nr"],
        "street": row["street"],
        "city": row["city"],
        "postalcode": row["postalcode"],
        "country": row["country"],
        "phonenr": row["phonenr"],
        "email": row["email"],
        "bankName": row["bank_name"],
        "bankAccountNr": row["bank_account_nr"]
    }


@router.put("/companysettings")
def save_company_settings(settings: CompanySettings):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO company_settings (
            id, name, reg_nr, street, city, postalcode, country,
            phonenr, email, bank_name, bank_account_nr
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            reg_nr = excluded.reg_nr,
            street = excluded.street,
            city = excluded.city,
            postalcode = excluded.postalcode,
            country = excluded.country,
            phonenr = excluded.phonenr,
            email = excluded.email,
            bank_name = excluded.bank_name,
            bank_account_nr = excluded.bank_account_nr
    """, (
        1,
        settings.name,
        settings.regNr,
        settings.street,
        settings.city,
        settings.postalcode,
        settings.country,
        settings.phonenr,
        settings.email,
        settings.bankName,
        settings.bankAccountNr
    ))

    conn.commit()
    conn.close()

    return {
        "message": "Company settings saved successfully"
    }