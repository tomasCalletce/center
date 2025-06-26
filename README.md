# Lets Acc



# Email System Setup

## Overview
Email system uses Resend for sending submission notification emails.

## Environment Variables
Add the following to your `.env` file:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

## Current Email Templates
- **Submission Received**: Sent when a user submits a challenge entry

## Structure
```
src/server/email/
├── config.ts              # Resend configuration
├── index.ts               # Main exports
├── services/
│   └── submission.ts      # Submission email service
└── templates/
    └── submission-received.tsx  # React email template
``` 