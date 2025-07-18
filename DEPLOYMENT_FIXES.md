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

### 5. GitHub Actions Workflow Issues ⚠️ **NEW FIX**
**Problem**: GitHub Actions workflows were missing dependency installation and Node.js setup steps.

**Solution**: Updated both workflow files to include proper steps:

#### `.github/workflows/firebase-hosting-merge.yml`
```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_MTG_AFFORD_CALC_API_SERVERLESS }}
          channelId: live
          projectId: mtg-afford-calc-api-serverless
```

#### `.github/workflows/firebase-hosting-pull-request.yml`
```yaml
name: Deploy to Firebase Hosting on PR
on: pull_request
permissions:
  checks: write
  contents: read
  pull-requests: write
jobs:
  build_and_preview:
    if: ${{ github.event.pull_request.head.repo.full_name == github.repository }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_MTG_AFFORD_CALC_API_SERVERLESS }}
          projectId: mtg-afford-calc-api-serverless
```

## Deployment Process

### Build and Deploy
1. **Build the application**: `npm run build`
2. **Deploy to Firebase**: `firebase deploy`

### GitHub Actions
Your GitHub Actions workflows should now work correctly:
- `.github/workflows/firebase-hosting-merge.yml` - deploys on push to main
- `.github/workflows/firebase-hosting-pull-request.yml` - creates preview deployments for PRs

## Verification
- ✅ Build now completes successfully
- ✅ Static export generates properly in `/out` directory
- ✅ Firebase configuration files are in place
- ✅ All problematic files removed and added to `.gitignore`
- ✅ GitHub Actions workflows fixed with proper Node.js setup and dependency installation

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
- `.github/workflows/firebase-hosting-merge.yml` (modified)
- `.github/workflows/firebase-hosting-pull-request.yml` (modified)
- Removed all `._*` files

## Common Troubleshooting

### If you still see failures:
1. **Check Firebase Service Account**: Ensure `FIREBASE_SERVICE_ACCOUNT_MTG_AFFORD_CALC_API_SERVERLESS` secret is properly set in GitHub
2. **Verify Project ID**: Confirm `mtg-afford-calc-api-serverless` is the correct Firebase project ID
3. **Check build logs**: Look for any remaining import/export issues in the build output

Your Firebase deployment should now work without issues!