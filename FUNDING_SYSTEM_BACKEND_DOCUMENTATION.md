# WorldwideAdverts Funding System - Backend Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Data Models & Database Schema](#data-models--database-schema)
4. [API Endpoints](#api-endpoints)
5. [Component Breakdown](#component-breakdown)
6. [Form Flow & Data Structure](#form-flow--data-structure)
7. [File Upload System](#file-upload-system)
8. [Payment Integration](#payment-integration)
9. [Error Handling & Validation](#error-handling--validation)
10. [Security Considerations](#security-considerations)

## Overview

The WorldwideAdverts Funding System is a comprehensive crowdfunding platform that allows users to create, manage, and promote funding projects. The system consists of 9 form steps, each handling specific aspects of project creation and management.

### Key Features
- Multi-step project creation form
- Real-time API integration
- File upload system for documents and media
- Promotion tier system with upsells
- Reward management system
- Identity verification
- Marketing assets management

## System Architecture

```
Frontend (React) → API Gateway → Backend Services → Database
     ↓                    ↓              ↓              ↓
Form Components → REST API → Business Logic → PostgreSQL/MySQL
```

### Frontend Components Flow
1. **ProjectTypeSelector** → Project type selection
2. **ProjectStoryVision** → Story and vision details
3. **FundingDetails** → Funding goals and milestones
4. **VerificationTrust** → Identity verification
5. **RewardsSection** → Reward tiers management
6. **PromotionMarketingAssets** → Marketing materials
7. **PremiumUpsaleOptions** → Promotion tier selection
8. **FinalSubmission** → Final review and submission

## Data Models & Database Schema

### Main Tables

#### projects
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    project_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    story TEXT,
    vision TEXT,
    funding_model VARCHAR(50) NOT NULL, -- 'donation', 'reward', 'equity', 'loan'
    funding_goal DECIMAL(12,2) NOT NULL,
    current_funding DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
    promotion_tier VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    metadata JSONB
);
```

#### project_funding_details
```sql
CREATE TABLE project_funding_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    use_of_funds JSONB, -- Array of funding purposes
    milestones JSONB, -- Array of milestone objects
    funding_breakdown JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### project_verification
```sql
CREATE TABLE project_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    identity_document_url VARCHAR(500),
    social_links JSONB, -- Array of social media objects
    verification_data JSONB,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### project_rewards
```sql
CREATE TABLE project_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    minimum_contribution DECIMAL(12,2) NOT NULL,
    limit_quantity INTEGER,
    estimated_delivery DATE,
    includes_shipping BOOLEAN DEFAULT FALSE,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### project_marketing_assets
```sql
CREATE TABLE project_marketing_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    pitch_video_url VARCHAR(500),
    documents JSONB, -- Array of document objects
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### project_documents
```sql
CREATE TABLE project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    mime_type VARCHAR(100),
    document_type VARCHAR(50), -- 'identity', 'marketing', 'reward', 'other'
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### promotion_plans
```sql
CREATE TABLE promotion_plans (
    id VARCHAR(50) PRIMARY KEY, -- 'basic', 'promoted', 'featured', 'sponsored'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    features JSONB, -- Array of feature strings
    visibility_multiplier INTEGER DEFAULT 1,
    badge_color VARCHAR(20),
    ribbon_text VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### project_promotions
```sql
CREATE TABLE project_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES promotion_plans(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'expired', 'cancelled'
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    amount_paid DECIMAL(10,2),
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Base URL: `/api/v1/funding`

#### Project Management
```
GET    /projects                    # Get all projects with filtering
GET    /projects/:id                # Get single project
POST   /projects                    # Create new project
PUT    /projects/:id                # Update project
DELETE /projects/:id                # Delete project
```

#### Project Details
```
GET    /projects/:id/funding-details    # Get funding details
PUT    /projects/:id/funding-details    # Update funding details
GET    /projects/:id/verification        # Get verification info
PUT    /projects/:id/verification        # Update verification
GET    /projects/:id/rewards             # Get rewards
PUT    /projects/:id/rewards             # Update rewards
GET    /projects/:id/marketing-assets    # Get marketing assets
PUT    /projects/:id/marketing-assets    # Update marketing assets
```

#### File Upload
```
POST   /projects/:id/documents          # Upload document
GET    /projects/:id/documents          # Get documents
DELETE /projects/:id/documents/:doc_id  # Delete document
POST   /upload                          # General file upload
```

#### Promotion System
```
GET    /upsells/plans                   # Get available promotion plans
GET    /upsells/comparison              # Get plan comparison
POST   /upsells/purchase                # Purchase promotion
GET    /upsells/my-upsells              # Get user's promotions
GET    /upsells/project/:id             # Get project promotions
POST   /upsells/:id/cancel              # Cancel promotion
GET    /upsells/stats                   # Get promotion statistics
```

#### Metadata
```
GET    /metadata                        # Get system metadata
GET    /metadata/categories             # Get categories
GET    /metadata/project-types          # Get project types
GET    /metadata/funding-models         # Get funding models
```

## Component Breakdown

### 1. ProjectTypeSelector.jsx
**Purpose:** Initial project type selection
**Data Flow:**
- User selects project type (personal, business, creative, etc.)
- Updates `formData.projectType`
- Calls `onNext()` to proceed

**Backend Integration:**
- Uses `GET /metadata/project-types` for available types
- No API calls needed for this step

### 2. ProjectStoryVision.jsx
**Purpose:** Capture project story and vision
**Data Flow:**
- Collects title, tagline, story, vision
- Updates `formData.title`, `formData.tagline`, `formData.story`, `formData.vision`
- Validates required fields

**Backend Integration:**
- Updates project via `PUT /projects/:id`
- Saves story and vision data

### 3. FundingDetails.jsx
**Purpose:** Define funding goals and milestones
**Data Flow:**
- Collects funding goal, currency, use of funds, milestones
- Updates `formData.fundingGoal`, `formData.currency`, `formData.useOfFunds`, `formData.milestones`
- Validates funding amount and milestones

**Backend Integration:**
- Updates via `PUT /projects/:id/funding-details`
- Stores structured funding data in JSONB fields

### 4. VerificationTrust.jsx
**Purpose:** Identity verification and social links
**Data Flow:**
- Collects social media links, identity document
- Updates `formData.socialLinks`, `formData.verificationStatus`, `formData.identityDocument`
- Handles file upload for identity document

**Backend Integration:**
- Updates via `PUT /projects/:id/verification`
- Uploads documents via `POST /projects/:id/documents`
- Stores verification status and social links

### 5. RewardsSection.jsx
**Purpose:** Create reward tiers for backers
**Data Flow:**
- Manages array of reward objects
- Each reward: title, description, min contribution, limit, delivery, shipping
- Updates `formData.rewards`

**Backend Integration:**
- Updates via `PUT /projects/:id/rewards`
- Creates/updates reward records in database

### 6. PromotionMarketingAssets.jsx
**Purpose:** Upload marketing materials
**Data Flow:**
- Collects pitch video URL, supporting documents
- Handles file uploads with progress tracking
- Updates `formData.pitchVideo`, `formData.documents`

**Backend Integration:**
- Updates via `PUT /projects/:id/marketing-assets`
- Uploads documents via `POST /upload` or `POST /projects/:id/documents`

### 7. PremiumUpsaleOptions.jsx
**Purpose:** Select promotion tier
**Data Flow:**
- Fetches available promotion plans from API
- User selects tier (basic, promoted, featured, sponsored)
- Updates `formData.promotionTier`

**Backend Integration:**
- Uses `GET /upsells/plans` for available plans
- Promotion purchased during final submission

### 8. FinalSubmission.jsx
**Purpose:** Final review and project submission
**Data Flow:**
- Displays project summary with promotion tier info
- Collects terms agreement and accuracy confirmation
- Submits complete project to backend

**Backend Integration:**
- Creates project via `POST /projects`
- Handles promotion purchase via `POST /upsells/purchase`
- Returns project ID for next steps

## Form Flow & Data Structure

### Complete Form Data Structure
```javascript
{
  // Basic Info
  projectType: 'personal',
  title: 'My Awesome Project',
  tagline: 'Changing the world',
  story: 'Long description...',
  vision: 'Future vision...',
  
  // Funding
  fundingModel: 'reward',
  fundingGoal: 10000,
  currency: 'USD',
  useOfFunds: [
    { purpose: 'Development', amount: 5000, description: 'Core development' },
    { purpose: 'Marketing', amount: 3000, description: 'Marketing campaign' },
    { purpose: 'Operations', amount: 2000, description: 'Operating costs' }
  ],
  milestones: [
    { title: 'MVP Launch', date: '2024-06-01', amount: 1000, completed: false },
    { title: 'Beta Release', date: '2024-08-01', amount: 5000, completed: false },
    { title: 'Full Launch', date: '2024-10-01', amount: 10000, completed: false }
  ],
  
  // Verification
  verificationStatus: 'pending',
  socialLinks: [
    { platform: 'twitter', url: 'https://twitter.com/user', followers: 1000 },
    { platform: 'linkedin', url: 'https://linkedin.com/in/user', followers: 500 }
  ],
  identityDocument: { url: '/uploads/identity.pdf', name: 'identity.pdf' },
  
  // Rewards
  rewards: [
    {
      title: 'Early Bird Special',
      description: 'Get early access plus exclusive updates',
      minimumContribution: 25,
      limit: 100,
      estimatedDelivery: '2024-07-01',
      includesShipping: false,
      shippingCost: 0
    }
  ],
  
  // Marketing
  pitchVideo: 'https://youtube.com/watch?v=example',
  documents: [
    { id: 1, name: 'Business Plan.pdf', url: '/uploads/plan.pdf', type: 'business' },
    { id: 2, name: 'Prototype Demo.mp4', url: '/uploads/demo.mp4', type: 'demo' }
  ],
  
  // Promotion
  promotionTier: 'featured',
  
  // Meta
  projectId: 'uuid-if-updating',
  agreeTerms: true,
  confirmAccuracy: true
}
```

## File Upload System

### Upload Flow
1. **Client Side:**
   - User selects file
   - File validation (size, type)
   - Progress tracking during upload

2. **API Endpoint:** `POST /upload`
   ```javascript
   // Request: FormData
   const formData = new FormData();
   formData.append('file', file);
   formData.append('document_type', 'identity');
   formData.append('project_id', projectId);
   
   // Response
   {
     success: true,
     data: {
       id: 'uuid',
       url: '/uploads/filename.pdf',
       name: 'filename.pdf',
       size: 1024000,
       mime_type: 'application/pdf'
     }
   }
   ```

3. **Server Side:**
   - Validate file (size, type, virus scan)
   - Store in cloud storage (S3, etc.)
   - Save metadata to database
   - Return file URL and metadata

### File Types Supported
- **Images:** jpg, jpeg, png, gif, webp (max 10MB)
- **Documents:** pdf, doc, docx, txt (max 20MB)
- **Videos:** mp4, mov, avi (max 100MB)
- **Audio:** mp3, wav (max 50MB)

## Payment Integration

### Promotion Purchase Flow
1. **User selects promotion tier** in PremiumUpsaleOptions
2. **Review and confirm** in FinalSubmission
3. **Payment processing** during project submission
4. **Activation** after successful payment

### Payment Integration Points
```javascript
// In FinalSubmission.jsx
if (totalCost > 0) {
  // Redirect to payment gateway
  const paymentData = {
    project_id: projectId,
    plan_id: promotionTier,
    amount: totalCost,
    currency: 'USD'
  };
  
  // Call payment gateway
  const paymentResult = await paymentGateway.process(paymentData);
  
  if (paymentResult.success) {
    // Activate promotion
    await fundingService.upsells.purchaseUpsell({
      project_id: projectId,
      plan_id: promotionTier,
      payment_id: paymentResult.paymentId,
      amount: totalCost
    });
  }
}
```

### Payment Gateway Requirements
- Support for multiple payment methods (credit card, PayPal, etc.)
- Webhook handling for payment confirmations
- Refund processing
- Subscription management for recurring promotions

## Error Handling & Validation

### Client-Side Validation
Each component validates its own data before proceeding:
```javascript
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title) {
    newErrors.title = 'Title is required';
  }
  
  if (formData.fundingGoal <= 0) {
    newErrors.fundingGoal = 'Funding goal must be greater than 0';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### API Error Handling
```javascript
try {
  const response = await fundingService.createProject(projectData);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    setError(error.response.data.message || 'Server error occurred');
  } else if (error.request) {
    // Network error
    setError('Network error. Please check your connection.');
  } else {
    // Other error
    setError('An unexpected error occurred.');
  }
}
```

### Standard Error Response Format
```javascript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid data provided',
    details: {
      title: 'Title is required',
      fundingGoal: 'Funding goal must be greater than 0'
    }
  }
}
```

## Security Considerations

### Authentication & Authorization
- All endpoints require valid JWT token
- User can only modify their own projects
- Admin endpoints for project moderation

### File Upload Security
- File type validation
- Virus scanning
- Size limits
- Secure storage with signed URLs
- Access control for uploaded files

### Data Validation
- Server-side validation for all inputs
- SQL injection prevention
- XSS protection
- CSRF protection

### Rate Limiting
- API rate limiting per user
- File upload limits
- Project creation limits

### Privacy Protection
- PII encryption
- GDPR compliance
- Data retention policies
- User data deletion capabilities

## Deployment Considerations

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/funding_db

# File Storage
AWS_S3_BUCKET=wwa-funding-uploads
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_project_promotions_project_id ON project_promotions(project_id);
CREATE INDEX idx_project_promotions_status ON project_promotions(status);
```

### Monitoring & Logging
- API response time monitoring
- Error tracking and alerting
- File upload monitoring
- User activity logging
- Payment transaction logging

## Testing Strategy

### Unit Tests
- API endpoint testing
- Data validation testing
- Business logic testing

### Integration Tests
- End-to-end form flow testing
- File upload testing
- Payment processing testing

### Performance Tests
- Load testing for concurrent users
- File upload performance
- Database query optimization

## Conclusion

This documentation provides a comprehensive guide for implementing the backend of the WorldwideAdverts Funding System. The system is designed to be scalable, secure, and user-friendly, with clear separation of concerns and robust error handling.

Key implementation priorities:
1. Set up database schema with proper relationships
2. Implement core CRUD operations for projects
3. Build file upload system with security measures
4. Integrate payment gateway for promotions
5. Implement proper authentication and authorization
6. Add comprehensive error handling and validation
7. Set up monitoring and logging systems

The frontend components are already built to work with this API structure, making integration straightforward once the backend is implemented.
