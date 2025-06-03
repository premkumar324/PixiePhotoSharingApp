# Pixie - Photo Sharing Platform

A modern photo sharing platform built with React, Tailwind CSS, and Appwrite.

## Features

- User authentication and authorization
- Photo uploads with image cropping
- Beautiful responsive design
- Post management (create, edit, delete)
- Gallery view with grid layout
- Mobile-friendly interface

## Deployment Steps

### 1. Appwrite Setup

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project
3. Set up the following:
   - Database with a 'posts' collection
   - Storage bucket for images
   - Authentication methods (email/password)
4. Note down these credentials:
   ```
   Project ID
   API Endpoint
   Database ID
   Collection ID
   Bucket ID
   ```

### 2. Vercel Deployment

1. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

2. Push your code to GitHub

3. Go to [vercel.com](https://vercel.com):
   - Sign up/Login with GitHub
   - Import your repository
   - Add environment variables:
     ```
     VITE_APPWRITE_URL=your_appwrite_endpoint
     VITE_APPWRITE_PROJECT_ID=your_project_id
     VITE_APPWRITE_DATABASE_ID=your_database_id
     VITE_APPWRITE_COLLECTION_ID=your_collection_id
     VITE_APPWRITE_BUCKET_ID=your_bucket_id
     ```
   - Deploy!

### Alternative Deployment Methods

#### Deploy from CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Manual Build

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pixie
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your Appwrite credentials

4. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with these variables:
```env
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
VITE_APPWRITE_BUCKET_ID=
```

## Support

For issues and feature requests, please create an issue on GitHub.
