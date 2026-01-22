# Launchpad HubSpot Custom Cards - Phase 1 Implementation

Complete implementation guide for the Founder Custom Card with extensible architecture for future phases.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup (Next.js)](#backend-setup)
3. [Frontend Setup (HubSpot Extension)](#frontend-setup)
4. [HubSpot Configuration](#hubspot-configuration)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Extensibility for Phase 2 & 3](#extensibility)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js 18+ and npm
- HubSpot account with CRM access
- HubSpot CLI installed globally: `npm install -g @hubspot/cli`
- Git for version control

### Required Access
- HubSpot Private App access token
- Permission to create custom CRM cards
- Access to create custom properties in HubSpot

---

## Backend Setup

### Step 1: Initialize Backend Project

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create `.env.local` file:

```bash
# HubSpot API Configuration
HUBSPOT_ACCESS_TOKEN=your_private_app_token_here
HUBSPOT_API_KEY=your_api_key_here

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
HUBSPOT_APP_DOMAIN=https://app.hubspot.com

# Association Label IDs (Get these from HubSpot)
ASSOCIATION_LABEL_FOUNDER=1
ASSOCIATION_LABEL_MENTOR=2
ASSOCIATION_LABEL_INVESTOR=3
ASSOCIATION_LABEL_SPONSOR=4
ASSOCIATION_LABEL_EVENT_HOST=5

NODE_ENV=development
```

### Step 3: Get HubSpot Private App Token

1. Go to HubSpot Settings → Integrations → Private Apps
2. Click "Create private app"
3. Name it "Launchpad Backend Integration"
4. Grant scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.companies.read`
   - `crm.schemas.contacts.read`
   - `crm.associations.read`
5. Copy the access token to `.env.local`

### Step 4: Create Custom Properties in HubSpot

Navigate to Settings → Properties → Contact Properties and create:

| Property Name | Internal Name | Type | Options |
|--------------|---------------|------|---------|
| Application Status | `application_status` | Dropdown | Applied, Accepted, Rejected, In Review |
| Deposit Status | `deposit_status` | Dropdown | Pending, Paid, Waived, Refunded |
| Onboarding Stage | `onboarding_stage` | Dropdown | Not Started, Profile Setup, Agreement Signed, Payment Complete, Onboarded |
| Current Cohort | `current_cohort` | Single-line text | - |
| Next Steps | `next_steps` | Multi-line text | - |

### Step 5: Run Backend Development Server

```bash
npm run dev
```

Backend will be available at `http://localhost:3000`

### Step 6: Test Backend API

```bash
# Test authentication
curl http://localhost:3000/api/auth

# Test founders endpoint
curl http://localhost:3000/api/founders

# Test specific contact
curl http://localhost:3000/api/contacts/YOUR_CONTACT_ID
```

---

## Frontend Setup

### Step 1: Initialize HubSpot Project

```bash
cd hubspot-extension

# Install dependencies
npm install

# Login to HubSpot CLI
hs auth

# Initialize project
hs project init
```

### Step 2: Configure Backend URL

Update `src/app/app.functions/crm-card.js`:

```javascript
const BACKEND_API_URL = 'https://your-backend-domain.com'; // Replace with your backend URL
```

For local development, use ngrok to expose localhost:

```bash
# Install ngrok
npm install -g ngrok

# Expose local backend
ngrok http 3000

# Use the ngrok URL in crm-card.js
const BACKEND_API_URL = 'https://abc123.ngrok.io';
```

### Step 3: Start Development Server

```bash
hs project dev
```

This will:
- Watch for file changes
- Hot-reload the extension
- Provide a local development URL

---

## HubSpot Configuration

### Step 1: Create Association Labels

1. Go to Settings → Data Management → Associations
2. Click "Create association label" for Contact-to-Company
3. Create labels:
   - Founder
   - Mentor
   - Investor
   - Sponsor
   - Event Host
4. Note the label IDs and update `.env.local`

### Step 2: Deploy the CRM Card

```bash
cd hubspot-extension
hs project upload
```

### Step 3: Add Card to Company Record

1. Navigate to any Company record in HubSpot
2. Click "Actions" → "Customize record"
3. Click "Add cards"
4. Find "Launchpad Founder Card"
5. Drag it to desired position
6. Click "Save"

### Step 4: Test Association Labels

1. Go to a Company record
2. Add a Contact
3. When adding, select "Founder" as the association label
4. The contact should appear in the Founder card

---

## Deployment

### Backend Deployment (Vercel)

```bash
cd backend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Go to Project Settings → Environment Variables
```

### Frontend Deployment

```bash
cd hubspot-extension

# Deploy to HubSpot
hs project upload --production
```

---

## Testing

### Backend Testing

```bash
# Test authentication
curl https://your-backend.vercel.app/api/auth

# Test founders with filters
curl "https://your-backend.vercel.app/api/founders?cohort=Fall%202024"

# Test contact update
curl -X PUT https://your-backend.vercel.app/api/contacts/123456 \
  -H "Content-Type: application/json" \
  -d '{"properties": {"next_steps": "Schedule onboarding call"}}'
```

### Frontend Testing

1. Navigate to a Company record with associated Founders
2. Verify the Founder card displays
3. Check all data fields are populated correctly
4. Test the Refresh button
5. Test with different application statuses
6. Verify onboarding progress bar

### Test Data

Create test contacts in HubSpot:

```javascript
// Test Founder 1
{
  firstname: "Jane",
  lastname: "Smith",
  email: "jane@startup.com",
  phone: "555-0100",
  application_status: "Accepted",
  deposit_status: "Paid",
  onboarding_stage: "Profile Setup",
  current_cohort: "Fall 2024",
  next_steps: "Complete agreement signing"
}

// Test Founder 2
{
  firstname: "John",
  lastname: "Doe",
  email: "john@venture.io",
  phone: "555-0200",
  application_status: "In Review",
  deposit_status: "Pending",
  onboarding_stage: "Not Started",
  current_cohort: "Winter 2025",
  next_steps: "Review application documents"
}
```

---

## Extensibility for Phase 2 & 3

### Phase 2: Additional Role Cards

The architecture is designed to easily add new role-based cards:

#### 1. Backend Extension

Add new API routes for each role:

```typescript
// src/app/api/mentors/route.ts
// src/app/api/investors/route.ts
// src/app/api/sponsors/route.ts
```

#### 2. Frontend Extension

Create new card components:

```javascript
// src/components/MentorCard.jsx
// src/components/InvestorCard.jsx
// src/components/SponsorCard.jsx
```

#### 3. Reusable Patterns

All cards can reuse:
- `StatusBadge` component
- API service functions
- Helper utilities
- Constants configuration

### Phase 3: Enhanced Features

#### Add Cohort Management

```typescript
// backend/src/app/api/cohorts/route.ts
export async function GET() {
  // Fetch all cohorts
}

export async function POST() {
  // Create new cohort
}
```

#### Add Course Integration

```typescript
// backend/src/app/api/courses/route.ts
export async function GET() {
  // Fetch courses
}
```

#### Build Admin UI

Create a separate dashboard for advanced workflows:

```bash
# backend/src/app/dashboard/page.tsx
```

---

## Troubleshooting

### Common Issues

#### 1. "Unauthorized" Error
- Verify `HUBSPOT_ACCESS_TOKEN` in `.env.local`
- Check Private App scopes
- Regenerate token if expired

#### 2. No Founders Displayed
- Verify association labels are set correctly
- Check contacts have "Founder" label
- View browser console for API errors
- Test backend endpoint directly

#### 3. Properties Not Showing
- Ensure custom properties are created
- Verify property internal names match code
- Check property permissions

#### 4. Card Not Loading
- Check HubSpot CLI is authenticated
- Verify serverless function is deployed
- Check browser console for errors
- Test with `hs project dev` for debugging

#### 5. CORS Errors
- Verify `next.config.js` CORS headers
- Check `HUBSPOT_APP_DOMAIN` environment variable
- Use proper backend URL (not localhost in production)

### Debug Mode

Enable debug logging:

```javascript
// In crm-card.js
console.log('Context:', context);
console.log('Response:', response);
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        HubSpot CRM                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Custom Founder Card (React)               │ │
│  │  - Displays founder data                               │ │
│  │  - Shows onboarding progress                           │ │
│  │  - Real-time status updates                            │ │
│  └─────────────────────┬─────────────────────────────────┘ │
└────────────────────────┼───────────────────────────────────┘
                         │
                    Serverless
                    Function
                         │
                         ▼
          ┌──────────────────────────┐
          │   Next.js Backend API     │
          │  ┌────────────────────┐   │
          │  │  /api/founders     │   │
          │  │  /api/contacts     │   │
          │  │  /api/associations │   │
          │  └────────────────────┘   │
          └──────────┬───────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   HubSpot CRM API    │
          │  - Contacts          │
          │  - Associations      │
          │  - Properties        │
          └──────────────────────┘
```

---

## Support & Resources

- [HubSpot Developer Documentation](https://developers.hubspot.com/)
- [HubSpot CRM Cards Guide](https://developers.hubspot.com/docs/platform/ui-extensions-sdk)
- [Next.js Documentation](https://nextjs.org/docs)
- [HubSpot API Client](https://github.com/HubSpot/hubspot-api-nodejs)

---

## License

MIT License - Copyright (c) 2025 Launchpad Incubator