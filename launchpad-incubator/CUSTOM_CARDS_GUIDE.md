# Launchpad HubSpot Custom Cards - Implementation Guide

## Overview
Custom HubSpot CRM cards for managing Launchpad incubator stakeholders with role-based filtering using association labels.

## Stakeholder Cards Created

### 1. Founder Onboarding Card ✅
- **File**: `get-started-app-card.tsx`
- **API**: `/api/founders`
- **Properties Required**:
  - `onboarding_status` (select)
  - `payment_status` (select)
  - `next_step` (text)
  - `cohort` (text)

### 2. Mentors Card ✅
- **File**: `mentors-card.tsx`
- **API**: `/api/mentors`
- **Properties Required**:
  - `mentor_expertise` (textarea)
  - `mentor_availability` (select)
  - `mentor_sessions_completed` (number)

### 3. Investors Card ✅
- **File**: `investors-card.tsx`
- **API**: `/api/investors`
- **Properties Required**:
  - `investor_focus` (text)
  - `investor_stage` (select)
  - `investor_ticket_size` (text)

### 4. Sponsors Card ✅
- **File**: `sponsors-card.tsx`
- **API**: `/api/sponsors`
- **Properties Required**:
  - `sponsorship_level` (select)
  - `contribution_amount` (text)
  - `sponsorship_status` (select)

### 5. Event Hosts Card ✅
- **File**: `event-hosts-card.tsx`
- **API**: `/api/event-hosts`
- **Properties Required**:
  - `event_host_organization_type` (text)
  - `events_hosted` (number)
  - `next_event` (text)

## Setup Instructions

### 1. Create Custom Properties

Run the script to create all required properties:

```bash
cd backend
npx tsx scripts/create-all-stakeholder-properties.ts
```

Or manually create them in HubSpot:
- Go to: Settings → Data Management → Properties → Contact properties
- Click "Create property" for each required property

### 2. Create Association Labels

In HubSpot, create custom association labels for contact-to-company relationships:

1. Go to: Settings → Data Management → Associations
2. Select: Contacts → Companies
3. Create labels:
   - `Founder`
   - `Mentor`
   - `Investor`
   - `Sponsor`
   - `Event Host`

### 3. Deploy Frontend Cards

```bash
cd launchpad-incubator
hs project upload
```

### 4. Deploy Backend APIs

```bash
cd backend
npm run build
vercel --prod
```

Or push to your deployment platform.

### 5. Associate Contacts with Companies

For each contact:
1. Open contact record
2. Go to Associated Companies
3. Add/Edit association
4. Select appropriate label (Founder, Mentor, etc.)

## Testing

### Test Founder Card
1. Open a company record with founder contacts
2. Navigate to "Founder Onboarding Card" tab
3. Should display all founders with their onboarding info

### Test Other Cards
1. Associate test contacts with appropriate labels
2. Open company record
3. Each card tab should show role-specific contacts

## API Endpoints

All endpoints support `?companyId={id}` parameter:

- `GET /api/founders?companyId=123` - Get founders
- `GET /api/mentors?companyId=123` - Get mentors
- `GET /api/investors?companyId=123` - Get investors
- `GET /api/sponsors?companyId=123` - Get sponsors
- `GET /api/event-hosts?companyId=123` - Get event hosts

## Troubleshooting

### Cards Not Showing Data
1. Check backend logs for association API responses
2. Verify custom properties exist in HubSpot
3. Ensure contacts are associated with correct labels
4. Check browser console for errors

### Association Labels Not Filtering
Currently, the cards show ALL contacts associated with a company. To filter by label:
1. You need to implement label-based filtering in the association API calls
2. Or create separate API endpoints that filter by association type ID

### Properties Returning N/A
- Verify property names match exactly in HubSpot
- Check that contacts have values for these properties
- Review API property lists in each route file

## Next Steps

1. **Implement Association Label Filtering**: Modify API routes to filter contacts by specific association labels
2. **Add Role Detection**: Automatically detect contact role and show relevant card
3. **Create Dashboard View**: Aggregate view showing all stakeholders
4. **Add Bulk Actions**: Enable bulk operations on stakeholders
5. **Implement Real-time Updates**: Add webhooks for automatic card refresh

## File Structure

```
launchpad-incubator/src/app/cards/
├── get-started-app-card.tsx              # Founder card
├── get-started-app-card-hsmeta.json      # Founder metadata
├── mentors-card.tsx                      # Mentors card
├── mentors-card-hsmeta.json              # Mentors metadata
├── investors-card.tsx                    # Investors card
├── investors-card-hsmeta.json            # Investors metadata
├── sponsors-card.tsx                     # Sponsors card
├── sponsors-card-hsmeta.json             # Sponsors metadata
├── event-hosts-card.tsx                  # Event hosts card
└── event-hosts-card-hsmeta.json          # Event hosts metadata

backend/app/api/
├── founders/route.ts                     # Founders API
├── mentors/route.ts                      # Mentors API
├── investors/route.ts                    # Investors API
├── sponsors/route.ts                     # Sponsors API
└── event-hosts/route.ts                  # Event hosts API
```

## Support

For issues or questions:
1. Check browser console and backend logs
2. Verify HubSpot property names
3. Test API endpoints directly via curl/Postman
4. Review HubSpot UI Extensions documentation
