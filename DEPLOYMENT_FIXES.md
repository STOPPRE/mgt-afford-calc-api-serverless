# Firebase Deployment Fixes

## Problems Identified and Fixed

### 1. MacOS Resource Fork Files
**Problem**: Build was failing due to corrupted macOS resource fork files (files starting with `._`) that were causing ESLint parsing errors.

**Solution**: 
- Removed all `._*` files that were causing build failures
- Added `._*` to `.gitignore` to prevent future issues

### 2. Missing Firebase Configuration
**Problem**: Missing essential Firebase configuration files for deployment.

**Solution**: Created the following files:

#### `firebase.json`
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### `.firebaserc`
```json
{
  "projects": {
    "default": "mtg-afford-calc-api-serverless"
  }
}
```

### 3. Next.js Configuration for Static Export
**Problem**: Next.js was not configured for static export required by Firebase Hosting.

**Solution**: Updated `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

### 4. Updated Build Scripts
**Problem**: Build scripts weren't optimized for Firebase deployment.

**Solution**: Updated `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Deployment Process

### Build and Deploy
1. **Build the application**: `npm run build`
2. **Deploy to Firebase**: `firebase deploy`

### GitHub Actions
Your existing GitHub Actions workflows should now work correctly:
- `.github/workflows/firebase-hosting-merge.yml` - deploys on push to main
- `.github/workflows/firebase-hosting-pull-request.yml` - creates preview deployments for PRs

## Verification
- ✅ Build now completes successfully
- ✅ Static export generates properly in `/out` directory
- ✅ Firebase configuration files are in place
- ✅ All problematic files removed and added to `.gitignore`

## Next Steps
1. Push these changes to your repository
2. The GitHub Actions should automatically trigger and deploy successfully
3. If deploying manually, run `firebase deploy` after building

## Files Created/Modified
- `firebase.json` (created)
- `.firebaserc` (created)
- `next.config.ts` (modified)
- `package.json` (modified)
- `.gitignore` (modified)
- Removed all `._*` files

Your Firebase deployment should now work without issues!