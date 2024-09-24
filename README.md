## Environment Variables

This project uses environment variables to manage sensitive information. To set up your environment:

1. For local development:
   - Copy `.env.example` to `.env.local`
   - Fill in your actual values in `.env.local`
   - **IMPORTANT**: Never commit `.env.local` to version control

2. For production (Vercel):
   - Set environment variables in the Vercel dashboard under your project settings

Remember, keeping your secret keys and sensitive information secure is crucial. Always use environment variables or secure secret management solutions, and never hardcode sensitive information in your source code.
