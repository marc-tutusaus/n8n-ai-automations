# 01 · Outlook invoices → Excel

Supplier invoices arrive by email as PDFs. This workflow reads them, extracts the data with AI, **checks it in code** and records it in an Excel table. Finance only looks at the invoices the workflow is not sure about.

## Flow

1. **Outlook trigger**: new email with attachments (attachments downloaded).
2. **Keep PDF attachments**: one item per PDF, so an email with several invoices works.
3. **Extract PDF text** (n8n's built-in Extract from File node).
4. **OpenAI**: extracts supplier, tax ID, invoice number, dates, net, VAT, total, currency and a confidence score, as **strict JSON**.
5. **Validate in code**: is it an invoice, are the required fields present, are the dates valid, **does net + VAT equal the total (±0.02)**, is the confidence ≥ 70.
6. **Valid** → only the table columns are kept → appended to the Excel table → the email is moved to *Processed*, once per email.
   **Not valid** → message to the finance channel in Teams with the reasons.

## Why it is built this way

- **The model reads, the code decides.** LLMs are good at finding "the total" in a messy PDF and bad at arithmetic, so the sum check is code.
- **Copy, don't calculate.** The prompt asks the model to copy values exactly as printed and use `null` when a value is missing. A missing total is a review case, not a guess.
- **Only clean data reaches Excel.** A dedicated node keeps just the table columns, so internal fields (`ok`, `issues`, message IDs) never end up in the spreadsheet.

## Setup

| | |
|---|---|
| Credentials | Microsoft Outlook, Microsoft Excel, Microsoft Teams (OAuth2), OpenAI API |
| Excel table columns | `processed_at` `supplier_name` `supplier_tax_id` `invoice_number` `invoice_date` `due_date` `currency` `net_amount` `vat_amount` `total_amount` `confidence` `file_name` `email_from` |
| Environment | `INVOICES_WORKBOOK_ID`, `INVOICES_WORKSHEET_ID`, `INVOICES_TABLE`, `OUTLOOK_PROCESSED_FOLDER_ID`, `TEAMS_TEAM_ID`, `TEAMS_FINANCE_CHANNEL_ID`, `OPENAI_MODEL` (optional) |

Tip: point the trigger at a dedicated mailbox or folder (for example *facturas@*), so only invoices are processed.
