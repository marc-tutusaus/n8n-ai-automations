# 04 · Drive documents → classified, renamed and logged

A shared *Inbox* folder in Google Drive where anyone drops scanned documents: invoices, receipts, delivery notes, quotes, contracts. The workflow identifies each one, gives it a standard name, files it, and keeps a register in Google Sheets.

## Flow

1. **Drive trigger**: a new file in the *Inbox* folder.
2. **Download** it and **extract the PDF text**.
3. **OpenAI**: document type, counterparty, date, reference, total, currency, one-line summary and confidence, as strict JSON.
4. **Decide name and folder** (code):
   - name: `YYYY-MM-DD_type_counterparty_reference.pdf` (accents and symbols removed), for example `2026-09-30_invoice_Cafe-Nordico-S-L_F-2026-88.pdf`
   - folder: **Processed**, or **Review** if the confidence is under 70, the type is *other*, or there is no date
5. **Drive**: rename, then move.
6. **Sheets**: one row per document, with a link to the file.

## Why it is built this way

- **Naming and routing rules live in code.** They are predictable, easy to change, and the same document always gets the same name.
- **No invented totals.** Tested with a delivery note that has no amount: the model returned `total_amount: null` instead of making one up.

## Setup

| | |
|---|---|
| Credentials | Google Drive, Google Sheets (OAuth2), OpenAI API |
| Drive | Folders *Inbox*, *Processed*, *Review* |
| Sheet *Documents* columns | `processed_at` `status` `doc_type` `counterparty` `document_date` `reference` `total_amount` `currency` `summary` `confidence` `file_name` `original_name` `file_url` |
| Environment | `DRIVE_INBOX_FOLDER_ID`, `DRIVE_PROCESSED_FOLDER_ID`, `DRIVE_REVIEW_FOLDER_ID`, `DOCUMENTS_SHEET_ID`, `OPENAI_MODEL` (optional) |
