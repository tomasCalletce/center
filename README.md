# Lets ACC

ACC connects builders with global companies that hire by skills.

**Get started in under 2 minutes at www.letsacc.com:**
- Upload your CV and complete onboarding
- Join live challenges and showcase your skills

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes ACC better for everyone.

**How to contribute:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Found a bug or have a feature idea? Open an issue and let's discuss it.

## Development Setup

### Environment Variables

1. Copy `.env.example` to `.env` and fill in the required values
2. Never commit your `.env` file to version control

**Required Variables:**
- `CLERK_SECRET_KEY` - Authentication secret
- `DATABASE_URI` - Database connection string
- `OPENAI_API_KEY` - AI processing
- `TRIGGER_SECRET_KEY` - Background jobs
- `RESEND_API_KEY` - Email service
- `BLOB_READ_WRITE_TOKEN` - File storage
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public auth key

## Security Notes

- Use strong, unique API keys for all services
- Rotate keys regularly
- Use environment-specific keys for different stages

## Email System

Uses Resend for submission notifications with React email templates.

```
src/server/email/
├── config.ts              # Resend configuration
├── services/
│   └── submission.ts      # Email service
└── templates/
    └── submission-received.tsx  # Email template
``` 

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 