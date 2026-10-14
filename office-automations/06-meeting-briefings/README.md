# 06 · Meeting briefings

About 30 minutes before a meeting with people **outside the company**, you get an email with what you need to remember: the context, the last interaction, open topics and a suggested agenda, all taken from your recent emails with them.

## Flow

1. **Schedule**: every 15 minutes in office hours (Monday to Friday, 08:00 to 18:45).
2. **Google Calendar**: events starting in the next 15 to 75 minutes.
3. **Filter (code)**: only timed events with at least one guest outside `INTERNAL_EMAIL_DOMAIN`, not briefed yet. Already-briefed meetings are remembered in the workflow's static data and cleaned after 7 days.
4. **Loop over meetings**, and for each one:
   - **Gmail**: up to 15 emails from or to the guests in the last 60 days
   - **OpenAI**: the briefing, using only facts from the emails and the event, and saying so when there is little history
   - **Gmail**: the briefing is sent to you

## Why it is built this way

- **Skip what does not need a briefing.** Internal meetings and all-day events are ignored, so the emails stay useful and are not noise.
- **Once per meeting.** The static-data memory means a meeting is briefed only once, even though the workflow runs every 15 minutes.

## Setup

| | |
|---|---|
| Credentials | Google Calendar, Gmail (OAuth2), OpenAI API |
| Environment | `INTERNAL_EMAIL_DOMAIN` (e.g. `yourcompany.com`), `BRIEFING_TO`, `BRIEFING_LANGUAGE` (default Spanish), `GENERIC_TIMEZONE`, `OPENAI_MODEL` (optional) |
