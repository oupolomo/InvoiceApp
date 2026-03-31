from pydantic import BaseModel
from typing import List

class InvoiceLine(BaseModel):
    description: str
    qty: int
    price: float


class Invoice(BaseModel):
    receiver: str
    receiverRegNr: str
    receiverStreet: str
    receiverCity: str
    receiverPostalcode: str
    receiverCountry: str
    receiverEmail: str
    receiverPhonenr: str
    invoiceNr: str
    comment: str
    invoiceDate: str
    paymentTerm: int
    lines: list[InvoiceLine]