# 07 · Web form → CRM + welcome email

A contact form built with n8n's own Form Trigger, so it needs no web development. Each lead is qualified by AI, saved in an Excel CRM and receives a personal welcome email at once. Hot leads are announced to the sales team on Teams.

## Flow

1. **n8n form** (`/form/contact`): name, email, company, company size (1-10, 11-50, 51-250, 250+), "How can we help?".
2. **Normalize submission**: trims and lowercases the email.
3. **OpenAI**: fit score (0-100), a summary of the need, the recommended service, the language and a personal welcome email (subject and body) that never mentions prices.
4. **Score lead in code**: final score = model fit + a company-size bonus (0 / 10 / 20 / 25), then tier **hot** (≥ 75), **warm** (≥ 45) or **cold**.
5. **Excel**: new row in the CRM table.
6. **Outlook**: sends the welcome email.
7. **Hot lead?** → message to the sales channel in Teams with the summary and the suggested service.

## Why it is built this way

- **An auditable score.** The model judges how well the need fits the services, and a transparent rule in code adds company size. Sales can see why a lead is "hot" and change the thresholds without touching the prompt.
- **A fast, personal first reply.** Writing in the lead's language and in their own words about their need gives a much better first impression than a generic auto-reply.

## Setup

| | |
|---|---|
| Credentials | Microsoft Excel, Microsoft Outlook, Microsoft Teams (OAuth2), OpenAI API |
| Excel CRM table columns | `submitted_at` `name` `email` `company` `company_size` `need` `need_summary` `recommended_service` `score` `tier` `status` |
| Environment | `CRM_WORKBOOK_ID`, `CRM_WORKSHEET_ID`, `CRM_TABLE`, `COMPANY_SERVICES` (list of your services, improves the fit score), `TEAMS_TEAM_ID`, `TEAMS_SALES_CHANNEL_ID`, `OPENAI_MODEL` (optional) |
