# KYC and Ad Moderation Implementation

This document outlines the comprehensive implementation of KYC verification and ad moderation features for the World Wide Adverts platform.

## 🎯 Features Implemented

### 1. Mandatory KYC on Registration
- **Location**: `src/Component/KYCVerification.jsx`
- **Description**: Users must complete KYC verification immediately after registration
- **Process**:
  - Two-step verification process
  - Personal information collection
  - Document upload (ID, photo with ID, address proof)
  - File validation (size, type)
  - Status tracking (pending, approved, rejected)

### 2. Website Access Restriction Until KYC Completion
- **Location**: `src/App.jsx` - `KYCProtectedRoute` component
- **Description**: Users cannot post ads or access certain features until KYC is approved
- **Protected Routes**:
  - All ad posting routes (`/post/*`)
  - User dashboard features
  - Advanced platform features

### 3. Automatic Deletion of Old Ads (3+ weeks)
- **Location**: `src/services/AdModerationService.js` - `deleteOldAds()`
- **Description**: System automatically removes ads older than 21 days
- **Implementation**:
  - Backend API endpoint for cleanup
  - Admin dashboard trigger
  - Batch deletion capability

### 4. Admin Approval System for All Ads
- **Location**: `src/Component/AdminModerationDashboard.jsx`
- **Description**: Every ad requires admin approval before going live
- **Features**:
  - Pending ads queue
  - Approval/rejection workflow
  - Rejection reason tracking
  - Real-time status updates

### 5. Harmful Ad Detection and Removal
- **Location**: `src/services/AdModerationService.js` - `detectHarmfulAds()`
- **Description**: Automated detection and removal of inappropriate content
- **Implementation**:
  - AI-powered content analysis
  - Keyword-based filtering
  - Image content moderation
  - Bulk removal capability

### 6. Admin Poster Role Testing
- **Location**: `src/Component/AdminModerationDashboard.jsx`
- **Description**: Admin can mark posts with special roles
- **Roles Available**:
  - **Sponsored**: Marked as sponsored content
  - **Promoted**: Highlighted promotional content
  - **Admin Post**: Official admin announcements

### 7. Ad Expiry Date Updating on Repost
- **Location**: `src/Component/RepostAd.jsx`
- **Description**: When users repost expired ads, the date updates to current date
- **Features**:
  - Confirmation dialog
  - Date refresh to current timestamp
  - Content preservation
  - Visibility renewal

## 🏗️ Architecture Overview

### Frontend Components
```
src/
├── Component/
│   ├── KYCVerification.jsx          # KYC verification flow
│   ├── AdminModerationDashboard.jsx # Admin moderation interface
│   └── RepostAd.jsx                # Ad reposting functionality
├── services/
│   └── AdModerationService.js      # API service for moderation
├── slice/
│   └── AdModerationSlice.js        # Redux state management
└── App.jsx                         # Route protection
```

### Redux State Management
- **AdModerationSlice**: Manages moderation state
  - Pending ads list
  - Harmful ads detection
  - Moderation statistics
  - Loading and error states

### API Endpoints (Backend Required)
```
POST /v1/ads/cleanup-old-ads          # Delete old ads
GET  /v1/ads/pending-approval         # Get pending ads
POST /v1/ads/{id}/approve             # Approve ad
POST /v1/ads/{id}/reject              # Reject ad
POST /v1/ads/detect-harmful           # Detect harmful ads
POST /v1/ads/delete-harmful           # Delete harmful ads
PUT  /v1/ads/{id}/poster-role         # Update poster role
POST /v1/ads/{id}/repost              # Repost ad with new date
GET  /v1/ads/moderation-stats         # Get statistics
```

## 🔐 Security Features

### KYC Security
- Document file validation (size, type)
- Secure file upload handling
- Encrypted data transmission
- Status-based access control

### Content Moderation
- Automated harmful content detection
- Manual admin review process
- Audit trail for all actions
- Bulk content removal capabilities

## 📊 Admin Dashboard Features

### Statistics Overview
- Pending approval count
- Harmful ads detected
- Old ads (>3 weeks)
- Total active ads

### Action Controls
- Delete old ads button
- Detect harmful ads button
- Delete harmful ads button
- Individual ad approval/rejection
- Poster role assignment

### Review Interface
- Ad preview and details
- Approval/rejection workflow
- Rejection reason input
- Role assignment options

## 🔄 User Experience Flow

### New User Registration
1. User creates account → Redirected to KYC
2. Completes KYC verification → Status: pending
3. Admin reviews KYC → Status: approved/rejected
4. Approved user gains full access

### Ad Posting Flow
1. User creates ad → Status: pending approval
2. Admin reviews ad → Approves/rejects
3. Approved ad goes live
4. Admin can assign special roles (sponsored, promoted, admin)

### Ad Reposting Flow
1. User finds expired ad
2. Clicks repost button
3. Confirms repost action
4. Ad date updates to current date
5. Ad regains visibility

## 🚀 Implementation Notes

### Frontend Integration
- All components use Tailwind CSS for styling
- Redux for state management
- React Router for navigation
- React Hot Toast for notifications

### Error Handling
- Comprehensive error states
- User-friendly error messages
- Automatic retry mechanisms
- Fallback UI components

### Performance Considerations
- Lazy loading for dashboard components
- Optimized API calls
- Efficient state updates
- Minimal re-renders

## 📋 Backend Requirements

### Database Schema Updates
```sql
-- Users table additions
ALTER TABLE users ADD COLUMN kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE users ADD COLUMN kyc_submitted_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN id_document_type VARCHAR(50);
ALTER TABLE users ADD COLUMN id_document_number VARCHAR(100);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN nationality VARCHAR(50);
ALTER TABLE users ADD COLUMN occupation VARCHAR(100);

-- Ads table additions
ALTER TABLE ads ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE ads ADD COLUMN approved_at TIMESTAMP NULL;
ALTER TABLE ads ADD COLUMN rejected_reason TEXT;
ALTER TABLE ads ADD COLUMN poster_role ENUM('normal', 'sponsored', 'promoted', 'admin') DEFAULT 'normal';
ALTER TABLE ads ADD COLUMN harmful_score INT DEFAULT 0;
ALTER TABLE ads ADD COLUMN is_harmful BOOLEAN DEFAULT FALSE;
```

### File Storage Setup
- Secure document upload endpoint
- File validation and virus scanning
- Cloud storage integration (S3/Azure)
- Document expiration policies

### Automated Tasks
- Daily old ads cleanup job
- Scheduled harmful content scanning
- KYC review notifications
- Admin dashboard statistics updates

## 🎯 Next Steps

### Immediate Actions
1. Implement backend API endpoints
2. Set up file storage infrastructure
3. Configure automated cleanup jobs
4. Test KYC flow end-to-end

### Future Enhancements
- Advanced AI content moderation
- Multi-level admin permissions
- Automated KYC verification
- Real-time notification system
- Advanced analytics dashboard

## 📞 Support

For any questions or issues with the implementation:
- Review the component documentation
- Check the Redux state structure
- Verify API endpoint implementations
- Test user flows thoroughly

This implementation provides a robust foundation for platform safety, compliance, and content quality while maintaining excellent user experience.
