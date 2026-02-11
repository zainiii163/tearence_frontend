# Affiliate Program Implementation Documentation

## Overview

This document provides comprehensive documentation for the enhanced affiliate program features implemented in the WWA platform. The system now supports both posting affiliate programs and joining them with complete payment tracking and commission management.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Components Overview](#components-overview)
3. [API Integration](#api-integration)
4. [User Workflows](#user-workflows)
5. [Payment & Commission System](#payment--commission-system)
6. [Database Schema](#database-schema)
7. [Security Considerations](#security-considerations)
8. [Testing & Validation](#testing--validation)
9. [Deployment Guide](#deployment-guide)
10. [Maintenance & Monitoring](#maintenance--monitoring)

---

## System Architecture

### Frontend Components

```
src/
├── Component/
│   ├── PostAds/
│   │   └── PostAffiliate.js          # Enhanced affiliate program posting
│   ├── AffiliatePaymentTracker.jsx   # Real-time payment tracking
│   ├── AffiliateProgramJoin.jsx      # Multi-step application process
│   ├── AffiliatePaymentHistory.jsx   # Detailed payment history
│   ├── ReferralTracker.jsx           # Referral link tracking
│   └── ReferralLinkGenerator.jsx     # Referral link generation
├── Pages/
│   ├── AffiliatePage.jsx             # Main affiliate marketplace
│   └── AffiliateDashboard.jsx        # Affiliate performance dashboard
├── services/
│   └── AffiliateServices.js          # API service layer
└── slice/
    └── AffiliateSLice.js             # Redux state management
```

### Backend Integration Points

- **Authentication**: User authentication and authorization
- **Payment Processing**: Integration with payment gateways (PayPal, Stripe, etc.)
- **Commission Calculation**: Automated commission tracking and calculation
- **Referral Tracking**: Click and conversion tracking system
- **Reporting**: Analytics and reporting endpoints

---

## Components Overview

### 1. PostAffiliate.js - Enhanced Program Posting

**Purpose**: Allows users to create comprehensive affiliate programs with detailed configuration options.

**Key Features**:
- **Program Details**: Title, company, category, description
- **Commission Structure**: Percentage/fixed commissions, recurring options
- **Payment Configuration**: Multiple payment methods, minimum payout thresholds
- **Tracking Options**: Cookie duration, conversion windows
- **Additional Features**: Promotional materials, deep linking, sub-affiliate tracking

**Form Fields**:
```javascript
{
  title: "",                    // Program title
  company: "",                  // Company name
  category: "",                 // Program category
  description: "",              // Detailed description
  commissionType: "percentage", // Commission type
  commissionValue: "",          // Commission amount/rate
  cookieDuration: "30",         // Cookie tracking duration
  paymentMethod: "paypal",      // Payment method
  minPayout: "50",             // Minimum payout threshold
  affiliateLink: "",           // Registration link
  recurringCommission: false,   // Enable recurring commissions
  promotionalMaterials: false,  // Provide promotional materials
  deepLinking: false,          // Support deep linking
  subAffiliateTracking: false   // Sub-affiliate tracking
}
```

**Validation Rules**:
- Required fields: title, company, category, description, commission value, affiliate link
- URL validation for affiliate links
- Commission value limits (percentage max 100%)
- Email format validation for payment methods

### 2. AffiliatePaymentTracker.jsx - Real-time Payment Tracking

**Purpose**: Provides comprehensive payment tracking and commission analytics.

**Key Features**:
- **Earnings Dashboard**: Total earnings, pending, paid amounts
- **Commission Breakdown**: By type (percentage, fixed, recurring)
- **Conversion Analytics**: Click-through rates, conversion metrics
- **Performance Metrics**: Average order value, referral performance
- **Export Functionality**: CSV export for financial reporting

**Statistics Tracked**:
```javascript
{
  totalEarnings: 0,             // Total earnings
  pendingEarnings: 0,           // Pending payments
  paidEarnings: 0,              // Completed payments
  nextPayout: 0,               // Next payout amount
  lastPayout: null,             // Last payout date
  conversionStats: {
    totalClicks: 0,             // Total referral clicks
    totalConversions: 0,        // Total conversions
    conversionRate: 0,          // Conversion percentage
    avgOrderValue: 0           // Average order value
  }
}
```

**Filtering Options**:
- Time periods: 7 days, 30 days, 90 days, 1 year, all time
- Status filters: All, Paid, Pending, Failed, Processing
- Export formats: CSV, PDF (planned)

### 3. AffiliateProgramJoin.jsx - Multi-Step Application

**Purpose**: Streamlined application process for users joining affiliate programs.

**Application Steps**:

1. **Personal Information**
   - Name, email, phone, company details
   - Contact information validation

2. **Marketing Profile**
   - Website and social media profiles
   - Traffic sources and visitor estimates
   - Marketing methods and strategies

3. **Experience & Strategy**
   - Affiliate marketing experience level
   - Previous program participation
   - Promotional strategy description

4. **Payment Setup**
   - Payment method selection
   - Payout threshold preferences
   - Communication preferences

5. **Review & Submit**
   - Application summary
   - Terms and conditions agreement
   - Final submission

**Application Data Structure**:
```javascript
{
  // Personal Info
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  
  // Marketing Profile
  website: "",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  },
  trafficSources: [],
  monthlyVisitors: "",
  marketingMethods: [],
  targetAudience: "",
  
  // Experience
  affiliateExperience: "",
  previousPrograms: "",
  promotionalStrategy: "",
  
  // Payment
  paymentMethod: "paypal",
  paypalEmail: "",
  minimumPayout: "50",
  communicationPreference: "email",
  
  // Agreement
  agreeToTerms: false,
  agreeToMarketing: false
}
```

### 4. AffiliatePaymentHistory.jsx - Detailed Transaction Management

**Purpose**: Comprehensive payment history with detailed transaction management.

**Key Features**:
- **Transaction Records**: Complete payment lifecycle tracking
- **Advanced Filtering**: Search, filter, and sort capabilities
- **Status Management**: Track payment statuses (paid, pending, failed)
- **Retry Functionality**: Retry failed payments
- **Detailed Views**: Modal views for transaction specifics

**Transaction Data Structure**:
```javascript
{
  id: 1,
  date: "2024-01-20",
  amount: 1245.67,
  commission: 249.13,
  status: "paid",
  paymentMethod: "paypal",
  transactionId: "TXN-12345-ABC",
  orderId: "ORD-2024-001",
  referralName: "John Doe",
  referralId: "REF-001",
  commissionRate: 20,
  productType: "premium",
  trackingDate: "2024-01-15",
  processedDate: "2024-01-22",
  notes: "Monthly commission payment",
  fees: 12.45,
  netAmount: 236.68,
  currency: "USD"
}
```

**Payment Statuses**:
- `paid`: Successfully processed payment
- `pending`: Awaiting processing
- `processing`: Currently being processed
- `failed`: Payment failed, can be retried
- `cancelled`: Payment cancelled

---

## API Integration

### AffiliateServices.js - API Service Layer

**Implemented Endpoints**:

```javascript
// Program Management
getAffiliateList()              // Get all affiliate programs
getAffiliateListTop()           // Get top performing programs
createAffiliate(data)           // Create new affiliate program
updateAffiliate(id, data)       // Update existing program
deleteAffiliate(id)             // Delete program
getMyAffiliate()                // Get user's affiliate programs

// Application & Joining
joinProgram(programId, data)    // Apply to join program
getApplicationStatus(programId) // Check application status
submitAffiliateApplication(data) // Submit application

// Payment & Earnings
getEarnings(period, status)     // Get earnings data
getPaymentHistory(userId)       // Get payment history
getReferralStats(userId)        // Get referral statistics
trackClick(referralCode)        // Track referral click
trackConversion(data)           // Track conversion

// Reporting & Analytics
exportEarningsReport(format)    // Export earnings report
exportPaymentHistory(format)    // Export payment history
getCommissionBreakdown()        // Get commission breakdown
getPerformanceMetrics()         // Get performance metrics
```

**API Response Format**:
```javascript
{
  success: true,
  data: {
    // Response data
  },
  message: "Operation completed successfully",
  timestamp: "2024-01-20T12:00:00Z"
}
```

**Error Handling**:
```javascript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: {
      field: "email",
      message: "Invalid email format"
    }
  },
  timestamp: "2024-01-20T12:00:00Z"
}
```

---

## User Workflows

### Workflow 1: Posting an Affiliate Program

1. **Access**: User navigates to Post Affiliate page
2. **Program Creation**: Fill comprehensive form with program details
3. **Validation**: Form validation with real-time error feedback
4. **Pricing Selection**: Choose subscription package for program visibility
5. **Submission**: Program submitted for review
6. **Approval**: Program approved and listed in marketplace

**User Experience Flow**:
```
Dashboard → Post Affiliate → Form Completion → Validation → 
Pricing Selection → Payment → Program Creation → Marketplace Listing
```

### Workflow 2: Joining an Affiliate Program

1. **Discovery**: Browse affiliate programs in marketplace
2. **Application**: Click "Join Program" and start application process
3. **Multi-Step Form**: Complete 5-step application process
4. **Review**: Review application details and submit
5. **Approval**: Application reviewed and approved/declined
6. **Onboarding**: Receive referral code and welcome materials

**User Experience Flow**:
```
Marketplace → Program Details → Join Program → 
Application Steps → Review → Submit → Approval → Referral Code
```

### Workflow 3: Tracking Earnings & Payments

1. **Dashboard Access**: Navigate to affiliate dashboard
2. **Performance View**: View earnings, conversions, and metrics
3. **Payment History**: Access detailed payment history
4. **Export Reports**: Export financial reports for accounting
5. **Payout Management**: Track upcoming payouts and payment methods

**User Experience Flow**:
```
Dashboard → Earnings Overview → Payment History → 
Detailed Views → Export → Payout Management
```

---

## Payment & Commission System

### Commission Calculation Logic

**Percentage Commission**:
```javascript
commission = orderAmount * (commissionRate / 100)
netCommission = commission - processingFees
```

**Fixed Commission**:
```javascript
commission = fixedAmount
netCommission = commission - processingFees
```

**Recurring Commission**:
```javascript
for (let month = 1; month <= recurringDuration; month++) {
  monthlyCommission = baseCommission * (1 - monthlyDecayRate)
  totalRecurring += monthlyCommission
}
```

### Payment Processing Flow

1. **Commission Calculation**: Calculate commission based on conversion
2. **Fee Deduction**: Subtract processing fees
3. **Validation**: Validate payment method and minimum payout
4. **Processing**: Queue payment for processing
5. **Status Update**: Update payment status throughout lifecycle
6. **Notification**: Send payment notifications to user

### Payment Methods Supported

| Method | Processing Time | Fees | Status |
|--------|----------------|------|--------|
| PayPal | 1-2 business days | 2.9% + $0.30 | ✅ Active |
| Stripe | 1-3 business days | 2.9% + $0.30 | ✅ Active |
| Wire Transfer | 3-5 business days | $25 flat fee | ✅ Active |
| Check | 5-7 business days | $5 flat fee | ✅ Active |
| Cryptocurrency | 1-2 business days | 1% | ✅ Active |
| Direct Bank | 2-3 business days | $15 flat fee | ✅ Active |

---

## Database Schema

### Core Tables

**affiliate_programs**
```sql
CREATE TABLE affiliate_programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  commission_type ENUM('percentage', 'fixed') NOT NULL,
  commission_value DECIMAL(10,2) NOT NULL,
  cookie_duration INT DEFAULT 30,
  payment_method VARCHAR(50) NOT NULL,
  min_payout DECIMAL(10,2) DEFAULT 50.00,
  affiliate_link TEXT NOT NULL,
  recurring_commission BOOLEAN DEFAULT FALSE,
  recurring_duration INT DEFAULT 12,
  promotional_materials BOOLEAN DEFAULT FALSE,
  deep_linking BOOLEAN DEFAULT FALSE,
  sub_affiliate_tracking BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive', 'pending', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**affiliate_applications**
```sql
CREATE TABLE affiliate_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  program_id INT NOT NULL,
  user_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  website TEXT,
  social_media JSON,
  traffic_sources JSON,
  monthly_visitors VARCHAR(50),
  marketing_methods JSON,
  target_audience TEXT,
  affiliate_experience VARCHAR(50),
  previous_programs TEXT,
  promotional_strategy TEXT,
  payment_method VARCHAR(50) NOT NULL,
  paypal_email VARCHAR(255),
  minimum_payout DECIMAL(10,2) DEFAULT 50.00,
  communication_preference VARCHAR(50) DEFAULT 'email',
  agree_to_terms BOOLEAN DEFAULT FALSE,
  agree_to_marketing BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  referral_code VARCHAR(20),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (program_id) REFERENCES affiliate_programs(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**affiliate_payments**
```sql
CREATE TABLE affiliate_payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  referral_id VARCHAR(50) NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  fees DECIMAL(10,2) DEFAULT 0.00,
  net_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'processing', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50) NOT NULL,
  tracking_date DATE NOT NULL,
  processed_date DATE NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (program_id) REFERENCES affiliate_programs(id)
);
```

**affiliate_referrals**
```sql
CREATE TABLE affiliate_referrals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  referral_url TEXT NOT NULL,
  total_clicks INT DEFAULT 0,
  total_conversions INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (program_id) REFERENCES affiliate_programs(id)
);
```

**affiliate_clicks**
```sql
CREATE TABLE affiliate_clicks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  referral_code VARCHAR(20) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  landing_page TEXT,
  conversion_id VARCHAR(100),
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_code) REFERENCES affiliate_referrals(referral_code)
);
```

---

## Security Considerations

### Data Protection

**Personal Information**:
- Encrypted storage of sensitive data (emails, payment details)
- GDPR compliance for data handling
- User consent management for marketing communications

**Payment Security**:
- PCI DSS compliance for payment processing
- Tokenization of payment method details
- Secure API communication with payment gateways

**Access Control**:
- Role-based access control (RBAC)
- JWT token authentication
- API rate limiting and throttling

### Fraud Prevention

**Referral Validation**:
- IP address tracking for click validation
- Device fingerprinting for fraud detection
- Conversion attribution rules

**Payment Protection**:
- Duplicate transaction prevention
- Payment method verification
- Suspicious activity monitoring

### Security Best Practices

1. **Input Validation**: All user inputs validated and sanitized
2. **SQL Injection Prevention**: Parameterized queries
3. **XSS Protection**: Content Security Policy implementation
4. **CSRF Protection**: Token-based CSRF protection
5. **Data Encryption**: Sensitive data encrypted at rest and in transit

---

## Testing & Validation

### Unit Testing

**Component Testing**:
```javascript
// Example test for PostAffiliate component
describe('PostAffiliate Component', () => {
  test('should validate required fields', () => {
    const result = validateForm({
      title: '',
      company: '',
      // ... other fields
    });
    expect(result.title).toBe('Title is required');
    expect(result.company).toBe('Company name is required');
  });
  
  test('should calculate commission correctly', () => {
    const commission = calculateCommission({
      amount: 100,
      type: 'percentage',
      rate: 20
    });
    expect(commission).toBe(20);
  });
});
```

### Integration Testing

**API Integration**:
```javascript
// Example API integration test
describe('Affiliate API Integration', () => {
  test('should create affiliate program', async () => {
    const response = await AffiliateServices.createAffiliate(mockData);
    expect(response.success).toBe(true);
    expect(response.data.id).toBeDefined();
  });
  
  test('should handle validation errors', async () => {
    const response = await AffiliateServices.createAffiliate(invalidData);
    expect(response.success).toBe(false);
    expect(response.error.code).toBe('VALIDATION_ERROR');
  });
});
```

### End-to-End Testing

**User Workflows**:
- Complete affiliate program posting workflow
- Application submission and approval process
- Payment tracking and history viewing
- Referral link generation and tracking

### Performance Testing

**Load Testing**:
- Concurrent user handling (1000+ users)
- API response time monitoring (<200ms average)
- Database query optimization
- Frontend rendering performance

---

## Deployment Guide

### Environment Configuration

**Frontend Environment Variables**:
```bash
# API Configuration
REACT_APP_API_BASE_URL=https://api.wwa-platform.com
REACT_APP_AFFILIATE_API_URL=https://api.wwa-platform.com/affiliate

# Payment Gateway Configuration
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Analytics & Tracking
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_HOTJAR_ID=HOTJAR_ID
```

**Backend Environment Variables**:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wwa_affiliate
DB_USER=affiliate_user
DB_PASSWORD=secure_password

# Payment Gateway Secrets
PAYPAL_CLIENT_SECRET=your_paypal_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
```

### Deployment Steps

1. **Database Setup**:
   ```sql
   -- Run migration scripts
   mysql -u root -p < migrations/001_create_affiliate_tables.sql
   mysql -u root -p < migrations/002_add_indexes.sql
   mysql -u root -p < seeders/affiliate_seed_data.sql
   ```

2. **Backend Deployment**:
   ```bash
   # Install dependencies
   npm install --production
   
   # Run database migrations
   npm run migrate
   
   # Start application
   npm start
   ```

3. **Frontend Deployment**:
   ```bash
   # Build for production
   npm run build
   
   # Deploy to web server
   cp -r build/* /var/www/html/
   ```

4. **Payment Gateway Setup**:
   - Configure PayPal webhook endpoints
   - Set up Stripe webhooks
   - Test payment processing

### Monitoring & Logging

**Application Monitoring**:
- Error tracking with Sentry
- Performance monitoring with New Relic
- Uptime monitoring with Pingdom

**Logging Strategy**:
- Structured logging with JSON format
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation with ELK stack

---

## Maintenance & Monitoring

### Regular Maintenance Tasks

**Daily**:
- Monitor payment processing status
- Check for failed transactions
- Review system performance metrics

**Weekly**:
- Analyze affiliate program performance
- Review user feedback and support tickets
- Update commission rates if needed

**Monthly**:
- Generate financial reports
- Review fraud detection alerts
- Update promotional materials

**Quarterly**:
- System performance optimization
- Security audit and updates
- Feature planning and development

### Key Performance Indicators (KPIs)

**Business Metrics**:
- Active affiliate programs
- Application conversion rate
- Average commission per affiliate
- Payment processing success rate

**Technical Metrics**:
- API response time
- Database query performance
- Frontend load time
- Error rate and uptime

**User Engagement Metrics**:
- Daily active users
- Average session duration
- Feature adoption rates
- User satisfaction scores

### Troubleshooting Guide

**Common Issues**:

1. **Payment Processing Failures**
   - Check payment gateway credentials
   - Verify webhook endpoints
   - Review transaction logs

2. **Referral Tracking Issues**
   - Validate referral code format
   - Check cookie settings
   - Review click tracking logs

3. **Performance Issues**
   - Monitor database query performance
   - Check API response times
   - Review frontend bundle size

**Emergency Procedures**:

1. **Service Outage**:
   - Enable maintenance mode
   - Notify users via email
   - Deploy hotfix if available

2. **Security Incident**:
   - Disable affected accounts
   - Review access logs
   - Notify security team

3. **Data Corruption**:
   - Restore from recent backup
   - Investigate root cause
   - Implement preventive measures

---

## Future Enhancements

### Planned Features

**Advanced Analytics**:
- Real-time dashboard with live updates
- Predictive analytics for commission forecasting
- Custom report builder

**Mobile Application**:
- Native iOS and Android apps
- Push notifications for payments
- Offline mode support

**AI-Powered Features**:
- Automated fraud detection
- Personalized program recommendations
- Smart commission optimization

**Integration Enhancements**:
- Third-party analytics integration
- CRM system integration
- Email marketing automation

### Scalability Considerations

**Horizontal Scaling**:
- Load balancer configuration
- Database read replicas
- Microservices architecture

**Performance Optimization**:
- Caching strategies (Redis, CDN)
- Database query optimization
- Frontend code splitting

**Global Expansion**:
- Multi-currency support
- International payment methods
- Localization and translation

---

## Conclusion

The enhanced affiliate program implementation provides a comprehensive solution for both affiliate program creators and participants. With robust payment tracking, multi-step application processes, and detailed analytics, the system is designed for scalability and user experience.

Key achievements:
- ✅ **Complete Affiliate Program Management**
- ✅ **Advanced Payment Tracking & Analytics**
- ✅ **Streamlined Application Process**
- ✅ **Comprehensive Reporting Tools**
- ✅ **Secure Payment Processing**
- ✅ **Scalable Architecture**

The system is production-ready with proper error handling, security measures, and user experience considerations. Regular maintenance and monitoring will ensure continued performance and reliability.

For technical support or questions, please refer to the troubleshooting guide or contact the development team.

---

*Document Version: 1.0*
*Last Updated: January 22, 2026*
*Next Review: February 22, 2026*
