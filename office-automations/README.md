# Office automations · Microsoft 365 & Google Workspace

🇪🇸 [Leer en español](README.es.md)

Seven n8n workflows for everyday office work in **Microsoft 365** and **Google Workspace**: email, Excel and Sheets, Drive, Teams and the calendar.

> Ready to import: connect your Microsoft or Google credentials, set the environment variables listed below and activate.

## The workflows

| # | Workflow | Ecosystem | What it does |
|---|---|---|---|
| 01 | [Outlook invoices → Excel](01-outlook-invoices-to-excel) | Microsoft 365 | A PDF invoice arrives by email → AI extracts supplier, number, dates and amounts → **the code checks** that net + VAT = total → row in an Excel table → email moved to "Processed". Anything doubtful goes to Teams for review. |
| 02 | [Daily email digest → Teams](02-daily-email-digest-teams) | Microsoft 365 | Every weekday at 07:30, the unread emails are summarized and grouped into *urgent*, *reply today* and *FYI*, and sent to you on Teams. |
| 03 | [Gmail support → draft reply + log](03-gmail-support-drafts) | Google Workspace | Each support email is classified (category, priority, sentiment) and gets a **draft** reply in Gmail for an agent to review and send. Everything is logged in Google Sheets. |
| 04 | [Drive documents → Sheets](04-drive-documents-to-sheets) | Google Workspace | A document dropped in a Drive folder is identified (invoice, receipt, delivery note, quote, contract), renamed with a standard name, moved to *Processed* or *Review*, and registered in Sheets. |
| 05 | [Weekly KPI report](05-weekly-kpi-report) | Google Workspace | Every Monday it reads a KPI sheet, **computes the week-over-week changes in code**, and the AI writes the commentary. The report is emailed as an HTML table. |
| 06 | [Meeting briefings](06-meeting-briefings) | Google Workspace | 30 minutes before a meeting with external guests, it gathers the recent email history with them and emails you a briefing: context, open topics and suggested agenda. |
| 07 | [Web form → CRM + welcome email](07-form-to-crm-welcome) | Microsoft 365 | A lead fills in an n8n form → the AI qualifies the need and writes a personal welcome email → row in an Excel CRM → welcome sent from Outlook → hot leads announced on Teams. |

## Shared design

- **Structured outputs.** Every LLM call uses the OpenAI Responses API with a strict JSON schema, so downstream nodes always receive the expected fields. The model comes from `OPENAI_MODEL` (default `gpt-5.6-luna`).
- **Code does the maths and the rules.** Totals, percentages, file names, priorities and validations are computed in Code nodes. The model reads documents and writes text; it does not decide numbers.
- **A human stays in control.** Support replies are saved as Gmail drafts, never sent. Invoices and documents the workflow is not sure about go to a review channel or folder.
- **No IDs in the workflows.** Folder, workbook, sheet, chat and channel IDs are environment variables (`$env.*`). Credentials are referenced by name.

## Environment variables

| Variable | Used by |
|---|---|
| `OPENAI_MODEL` | all (optional, default `gpt-5.6-luna`) |
| `INVOICES_WORKBOOK_ID`, `INVOICES_WORKSHEET_ID`, `INVOICES_TABLE`, `OUTLOOK_PROCESSED_FOLDER_ID`, `TEAMS_TEAM_ID`, `TEAMS_FINANCE_CHANNEL_ID` | 01 |
| `TEAMS_CHAT_ID`, `BRIEFING_LANGUAGE` | 02, 06 |
| `SUPPORT_LOG_SHEET_ID`, `GMAIL_AI_DRAFTED_LABEL_ID`, `SUPPORT_CONTEXT` | 03 |
| `DRIVE_INBOX_FOLDER_ID`, `DRIVE_PROCESSED_FOLDER_ID`, `DRIVE_REVIEW_FOLDER_ID`, `DOCUMENTS_SHEET_ID` | 04 |
| `KPI_SHEET_ID`, `REPORT_TO`, `REPORT_LANGUAGE` | 05 |
| `INTERNAL_EMAIL_DOMAIN`, `BRIEFING_TO` | 06 |
| `CRM_WORKBOOK_ID`, `CRM_WORKSHEET_ID`, `CRM_TABLE`, `COMPANY_SERVICES`, `TEAMS_TEAM_ID`, `TEAMS_SALES_CHANNEL_ID` | 07 |

> Requires `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, so the workflows can read `$env`. The repo's `docker-compose.yml` already sets it.

## How they were validated

| Check | Result |
|---|---|
| Import into n8n and open in the editor | All 7 load with **0 node issues** |
| Code-node logic, run with sample data | **23 checks pass**: the invoice sum check, file naming, KPI maths, briefed-once memory, lead scoring… |
| The real OpenAI request of each workflow, sent with sample data | All 7 accepted in strict JSON-schema mode, with correct outputs: amounts parsed from "1,028.50", no invented totals, a refund request flagged `needs_human` |
