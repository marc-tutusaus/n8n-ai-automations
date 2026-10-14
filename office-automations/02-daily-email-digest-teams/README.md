# 02 · Daily email digest → Teams

Every weekday at 07:30 you get a Teams message telling you what in your inbox needs attention first.

## Flow

1. **Schedule**: Monday to Friday at 07:30.
2. **Outlook**: unread emails received in the last 24 hours (up to 60).
3. **Compact list for the AI**: sender, subject, importance and a 400-character preview of each email, numbered. Full bodies are not sent to the model.
4. **No unread emails?** The workflow stops quietly.
5. **OpenAI** groups them into **urgent** (with the reason and the next step), **reply today** and **FYI**, referring to emails by number.
6. **Format**: the Teams message is built in code with the **real sender and subject from Outlook**. The model only provides the grouping and the one-line explanations.
7. **Teams**: message to your chat.

## Why it is built this way

- **Previews, not full emails.** That is enough to triage, and it costs fewer tokens and exposes less content.
- **The model cannot misquote a sender.** It returns email numbers, and the code looks up the real data.

## Setup

| | |
|---|---|
| Credentials | Microsoft Outlook, Microsoft Teams (OAuth2), OpenAI API |
| Environment | `TEAMS_CHAT_ID`, `BRIEFING_LANGUAGE` (default Spanish), `OPENAI_MODEL` (optional) |
