# 05 · Weekly KPI report

Many teams keep their daily numbers in a spreadsheet. Every Monday this workflow turns that sheet into a short management report: a table with this week against last week, plus a written commentary.

## Flow

1. **Schedule**: Mondays at 08:00.
2. **Google Sheets**: reads the *Daily KPIs* sheet.
3. **Compute KPIs in code**: totals for the last 7 days and the 7 before, % change, average order value and ticket backlog change.
4. **OpenAI** writes the subject, headline, highlights, concerns and suggested actions, **using only the numbers it receives**.
5. **HTML email** built in code (the table comes from the computed numbers) and sent with Gmail.

## Why it is built this way

**Code does the maths, the model writes the words.** LLMs make arithmetic mistakes; in another project I caught one off by a factor of 1,000 ([agentic-data-assistant](https://github.com/marc-tutusaus/agentic-data-assistant#second-lesson-never-let-the-model-do-arithmetic)). Here every figure in the email comes from code, and the prompt forbids the model from computing new ones. The email footer says so: *"Figures computed by the workflow; text written by AI from those figures."*

## Setup

| | |
|---|---|
| Credentials | Google Sheets, Gmail (OAuth2), OpenAI API |
| Sheet *Daily KPIs* columns | `date` (YYYY-MM-DD) `revenue` `orders` `new_customers` `tickets_opened` `tickets_closed` |
| Environment | `KPI_SHEET_ID`, `REPORT_TO`, `REPORT_LANGUAGE` (default Spanish), `OPENAI_MODEL` (optional) |

To track other metrics, edit the `metrics` list in *Compute KPIs in code*.
