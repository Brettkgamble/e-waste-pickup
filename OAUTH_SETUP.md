# OAuth Setup Guide

## Error: "The redirect_uri is not associated with this application"

This error occurs when the OAuth provider (GitHub or Google) doesn't recognize the redirect URL being sent from your application. Here's how to fix it:

## Required Environment Variables

You **must** set these environment variables in your `.env.local` file (in the `apps/web` directory):

```env
# Required for OAuth redirect URL configuration
NEXTAUTH_URL=http://localhost:3000
# Generate a secure secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# GitHub OAuth
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-app-secret

# Google OAuth (optional)
GOOGLE_ID=your-google-app-id
GOOGLE_SECRET=your-google-app-secret
```

## Steps to Fix

### 1. **Set NEXTAUTH_URL** (Most Important)
- For development: `http://localhost:3000`
- For production: `https://yourdomain.com`

### 2. **Generate NEXTAUTH_SECRET**
```bash
openssl rand -base64 32
```
Copy the output and paste it in your `.env.local` file.

### 3. **Update GitHub OAuth Settings**
If using GitHub OAuth, go to your GitHub app settings and ensure the Authorization callback URL matches:
- `http://localhost:3000/api/auth/callback/github` (development)
- `https://yourdomain.com/api/auth/callback/github` (production)

### 4. **Update Google OAuth Settings**
If using Google OAuth, add the authorized redirect URIs:
- `http://localhost:3000/api/auth/callback/google` (development)
- `https://yourdomain.com/api/auth/callback/google` (production)

## File Location
Create/edit: `apps/web/.env.local` (this file is gitignored)

Example:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-28
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
SANITY_API_READ_TOKEN=your-token
SANITY_API_WRITE_TOKEN=your-token

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret-here
GITHUB_ID=your-id
GITHUB_SECRET=your-secret
GOOGLE_ID=your-id
GOOGLE_SECRET=your-secret
```

## Common Issues

### Issue: Still getting redirect_uri error after setting NEXTAUTH_URL
- Ensure you've restarted the dev server after adding the environment variables
- Check that `NEXTAUTH_URL` matches exactly what's in your OAuth provider settings
- Clear browser cache and cookies

### Issue: Wrong port
- If you're running on a different port (e.g., 3001), update `NEXTAUTH_URL=http://localhost:3001`
- Update the authorized redirect URL in your OAuth provider settings

### Issue: Missing NEXTAUTH_SECRET
- This can cause unpredictable behavior with session encryption
- Generate one: `openssl rand -base64 32`

## Verifying It's Working

1. Restart your dev server: `pnpm run dev`
2. Navigate to the app's sign-in page
3. Click "Sign in with GitHub" (or Google)
4. You should be redirected to the OAuth provider, not see an error

If you still see the redirect_uri error, it's a mismatch between your `NEXTAUTH_URL` and what's registered in the OAuth app settings.
