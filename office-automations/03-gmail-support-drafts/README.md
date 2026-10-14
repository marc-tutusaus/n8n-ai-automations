# 03 · Gmail support → AI draft reply + log

For a shared support mailbox in Gmail. Every new request is classified and gets a **draft** reply in the same thread. An agent reviews it, edits it if needed and sends it. Nothing is sent automatically.

## Flow

1. **Gmail trigger**: new unread emails with the label `support` that are not yet labeled `ai-drafted`.
2. **Normalize email**: sender, subject, plain-text body, thread ID.
3. **OpenAI**: category, priority, sentiment, language, `needs_human` and the draft reply, as strict JSON.
4. **Gmail**: creates the **draft in the same thread**, addressed to the customer.
5. **Gmail**: adds the label `ai-drafted`, so the email is never processed twice.
6. **Google Sheets**: logs the classification with a link to the thread. The draft text is not logged.

## Why it is built this way

- **A draft, not a reply.** The agent stays in control, and the AI saves them the blank page.
- **Explicit limits in the prompt.** Never promise refunds, discounts or deadlines. Anything that needs a decision (refund, complaint, cancellation, legal) is marked `needs_human` and gets a short holding reply. Tested with a "they charged me twice" email: classified as *billing / high / needs_human*.
- **The label is the lock.** The trigger query excludes `ai-drafted`, so a re-run or a manual execution never creates duplicate drafts.

## Setup

| | |
|---|---|
| Credentials | Gmail, Google Sheets (OAuth2), OpenAI API |
| Gmail | Labels `support` and `ai-drafted` (the latter's ID goes in `GMAIL_AI_DRAFTED_LABEL_ID`) |
| Sheet *Log* columns | `logged_at` `from` `subject` `category` `priority` `sentiment` `language` `needs_human` `reason` `thread_url` |
| Environment | `SUPPORT_LOG_SHEET_ID`, `GMAIL_AI_DRAFTED_LABEL_ID`, `SUPPORT_CONTEXT` (optional company context for better drafts), `OPENAI_MODEL` (optional) |
