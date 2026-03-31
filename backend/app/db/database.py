from pathlib import Path
import sqlite3
import os

DB_PATH = os.getenv("DB_PATH")

if not DB_PATH:
    BASE_DIR = Path(__file__).resolve().parents[3]
    DB_PATH = str(BASE_DIR / "invoices.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            receiver TEXT NOT NULL,
            receiver_reg_nr TEXT NOT NULL,
            receiver_street TEXT NOT NULL,
            receiver_city TEXT NOT NULL,
            receiver_postalcode TEXT NOT NULL,
            receiver_country TEXT NOT NULL,
            receiver_email TEXT NOT NULL,
            receiver_phonenr TEXT NOT NULL,
            invoice_nr TEXT NOT NULL,
            comment TEXT NOT NULL,
            invoice_date TEXT NOT NULL,
            payment_term TEXT NOT NULL,
            lines_json TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS company_settings (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            reg_nr TEXT NOT NULL,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            postalcode TEXT NOT NULL,
            country TEXT NOT NULL,
            phonenr TEXT NOT NULL,
            email TEXT NOT NULL,
            bank_name TEXT NOT NULL,
            bank_account_nr TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            regNr TEXT,
            street TEXT,
            city TEXT,
            postalcode TEXT,
            country TEXT,
            phonenr TEXT,
            email TEXT,
            bankName TEXT,
            bankAccountNr TEXT
        )
        """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS invoice_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL
        )
        """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER
        )
        """)
    conn.commit()
    conn.close()