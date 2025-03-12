# MCOC Alliance War Planner - Deployment Guide

## Overview

This document provides instructions for deploying the MCOC Alliance War Planner application. The application is built with React, TypeScript, and Supabase, and can be deployed to various hosting platforms.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account
- Git

## Setting Up Supabase

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com/) and sign in or create an account
   - Create a new project and note your project URL and API keys

2. **Run Database Migrations**:
   - The project includes migration files in the `supabase/migrations` directory
   - These migrations will set up all necessary tables and relationships
   - You can run these migrations using the Supabase CLI or directly in the SQL Editor in the Supabase dashboard

3. **Set Up Authentication**:
   - In your Supabase dashboard, go to Authentication → Settings
   - Configure Email auth provider
   - Optionally, set up Google OAuth provider
   - Configure site URL and redirect URLs for your production domain

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For production deployment, make sure to set these environment variables in your hosting platform.

## Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mcoc-alliance-war-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

## Building for Production

1. **Create a production build**:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview the production build locally** (optional):
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Deployment Options

### Option 1: Vercel

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Import your project in Vercel**:
   - Go to [Vercel](https://vercel.com/) and sign in
   - Click "New Project" and import your repository
   - Configure the project settings:
     - Framework Preset: Vite
     - Build Command: `npm run build` or `yarn build`
     - Output Directory: `dist`
     - Install Command: `npm install` or `yarn install`

3. **Set environment variables**:
   - Add your Supabase URL and anon key as environment variables

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete

### Option 2: Netlify

1. **Push your code to a Git repository**

2. **Import your project in Netlify**:
   - Go to [Netlify](https://netlify.com/) and sign in
   - Click "New site from Git" and select your repository
   - Configure the build settings:
     - Build Command: `npm run build` or `yarn build`
     - Publish Directory: `dist`

3. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Add your Supabase URL and anon key

4. **Deploy**:
   - Click "Deploy site"

### Option 3: GitHub Pages

1. **Install gh-pages package**:
   ```bash
   npm install --save-dev gh-pages
   # or
   yarn add --dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts** to include the correct base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // other config
   });
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

## Post-Deployment Steps

1. **Update Supabase Auth Settings**:
   - Add your production URL to the site URL and redirect URLs in Supabase Auth settings

2. **Seed Initial Data** (optional):
   - You may want to seed initial data for champions, alliance structure, etc.
   - This can be done through the Supabase dashboard or using the provided seed scripts

3. **Create an Admin User**:
   - Register a user through the application
   - In the Supabase dashboard, update this user's role to 'officer' in the users table

## QR Code Feature Configuration

The QR code feature for roster updates requires proper URL configuration:

1. **Ensure Public Access**:
   - The `/roster-update/:memberId` route must be publicly accessible
   - This route is already configured to not require authentication

2. **Update URL Generation**:
   - If you're using a custom domain, make sure the QR code generation uses the correct base URL
   - The code uses `window.location.origin` which should work in most cases

3. **Test QR Codes**:
   - Generate a QR code for a member
   - Scan it with a mobile device to ensure it correctly opens the roster update page

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and anon key are correct
- Check that your IP is not blocked by Supabase
- Ensure your RLS policies are correctly configured

### Authentication Problems

- Verify redirect URLs in Supabase Auth settings
- Check browser console for CORS errors
- Ensure your site URL is correctly set in Supabase

### QR Code Scanning Issues

- Ensure the generated URL is accessible from the scanning device
- Check that the URL includes the correct protocol (https://)
- Verify the memberId parameter is correctly included in the URL

## Maintenance

### Database Backups

Regularly backup your Supabase database using the Supabase dashboard or API.

### Updates

Keep dependencies updated by periodically running:

```bash
npm update
# or
yarn upgrade
```

### Monitoring

Set up monitoring for your application using services like:
- Sentry for error tracking
- Google Analytics for usage statistics
- Uptime Robot for availability monitoring

## Support

For issues or questions, please refer to the project documentation or contact the development team.
