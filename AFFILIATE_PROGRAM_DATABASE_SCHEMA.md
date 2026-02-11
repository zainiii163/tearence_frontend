# WWA Affiliate Program Database Schema

## Overview
This schema supports both posting affiliate programs and joining programs to earn commissions.

## Tables

### 1. affiliate_programs
Stores affiliate programs posted by users/companies

```sql
CREATE TABLE affiliate_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    commission_type ENUM('percentage', 'fixed') NOT NULL,
    commission_value DECIMAL(10,2) NOT NULL,
    cookie_duration INT DEFAULT 30, -- days
    payment_method ENUM('paypal', 'stripe', 'wire', 'check', 'crypto', 'bank') DEFAULT 'paypal',
    min_payout DECIMAL(10,2) DEFAULT 50.00,
    affiliate_link TEXT NOT NULL,
    image_url TEXT,
    position ENUM('top', 'bottom', 'regular') DEFAULT 'regular',
    
    -- Advanced features
    tracking_method ENUM('cookie', 'pixel', 'postback') DEFAULT 'cookie',
    conversion_window INT DEFAULT 30, -- days
    recurring_commission BOOLEAN DEFAULT FALSE,
    recurring_duration INT DEFAULT 12, -- months
    tiered_commission BOOLEAN DEFAULT FALSE,
    bonus_conditions TEXT,
    restrictions TEXT,
    promotional_materials BOOLEAN DEFAULT FALSE,
    deep_linking BOOLEAN DEFAULT FALSE,
    sub_affiliate_tracking BOOLEAN DEFAULT FALSE,
    
    -- Status and metadata
    status ENUM('active', 'inactive', 'pending', 'suspended') DEFAULT 'pending',
    featured BOOLEAN DEFAULT FALSE,
    priority_score INT DEFAULT 0,
    
    -- Package and pricing
    package_id UUID,
    package_type VARCHAR(100),
    estimated_earnings DECIMAL(10,2),
    
    -- Owner information
    created_by UUID NOT NULL REFERENCES users(id),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_featured (featured),
    INDEX idx_priority (priority_score DESC)
);
```

### 2. affiliate_applications
Stores applications from users wanting to join affiliate programs

```sql
CREATE TABLE affiliate_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    applicant_id UUID NOT NULL REFERENCES users(id),
    
    -- Personal Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    
    -- Professional Information
    website TEXT,
    social_media JSON, -- facebook, twitter, instagram, linkedin, youtube
    
    -- Traffic & Marketing
    traffic_sources JSON, -- array of traffic sources
    monthly_visitors VARCHAR(50),
    marketing_methods JSON, -- array of marketing methods
    target_audience TEXT,
    
    -- Experience
    affiliate_experience ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    previous_programs TEXT,
    promotional_strategy TEXT,
    
    -- Payment Information
    payment_method ENUM('paypal', 'stripe', 'wire', 'check') DEFAULT 'paypal',
    paypal_email VARCHAR(255),
    bank_details JSON, -- account_name, account_number, routing_number, bank_name, swift_code
    
    -- Preferences
    preferred_commission_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    minimum_payout DECIMAL(10,2) DEFAULT 50.00,
    communication_preference ENUM('email', 'sms', 'both') DEFAULT 'email',
    
    -- Application Status
    status ENUM('pending_review', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending_review',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Agreement
    agree_to_terms BOOLEAN DEFAULT FALSE,
    agree_to_marketing BOOLEAN DEFAULT FALSE,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE KEY unique_program_applicant (program_id, applicant_id),
    INDEX idx_program_id (program_id),
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_status (status)
);
```

### 3. affiliate_members
Stores approved affiliate members with their unique referral codes

```sql
CREATE TABLE affiliate_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    user_id UUID NOT NULL REFERENCES users(id),
    application_id UUID NOT NULL REFERENCES affiliate_applications(id),
    
    -- Referral Information
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referral_link TEXT NOT NULL,
    
    -- Commission Structure (can override program defaults)
    commission_type ENUM('percentage', 'fixed'),
    commission_value DECIMAL(10,2),
    custom_commission BOOLEAN DEFAULT FALSE,
    
    -- Member Status
    status ENUM('active', 'inactive', 'suspended', 'terminated') DEFAULT 'active',
    tier ENUM('basic', 'silver', 'gold', 'platinum') DEFAULT 'basic',
    
    -- Performance Tracking
    total_clicks INT DEFAULT 0,
    total_conversions INT DEFAULT 0,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_paid DECIMAL(15,2) DEFAULT 0.00,
    
    -- Dates
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP,
    last_activity_at TIMESTAMP,
    
    -- Indexes
    UNIQUE KEY unique_program_user (program_id, user_id),
    UNIQUE KEY idx_referral_code (referral_code),
    INDEX idx_program_id (program_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_tier (tier)
);
```

### 4. affiliate_clicks
Tracks all clicks on affiliate links

```sql
CREATE TABLE affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES affiliate_members(id),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    
    -- Click Information
    referral_code VARCHAR(20) NOT NULL,
    target_url TEXT NOT NULL,
    landing_url TEXT,
    
    -- Visitor Information
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet'),
    browser VARCHAR(100),
    
    -- Tracking
    session_id VARCHAR(255),
    fingerprint VARCHAR(255),
    referrer TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    
    -- Status
    converted BOOLEAN DEFAULT FALSE,
    conversion_id UUID,
    
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_member_id (member_id),
    INDEX idx_program_id (program_id),
    INDEX idx_referral_code (referral_code),
    INDEX idx_clicked_at (clicked_at),
    INDEX idx_converted (converted),
    INDEX idx_ip_address (ip_address)
);
```

### 5. affiliate_conversions
Tracks successful conversions/sales

```sql
CREATE TABLE affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    click_id UUID NOT NULL REFERENCES affiliate_clicks(id),
    member_id UUID NOT NULL REFERENCES affiliate_members(id),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    
    -- Conversion Information
    order_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Commission Calculation
    commission_type ENUM('percentage', 'fixed') NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    
    -- Recurring Commission
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_period INT, -- month number
    parent_conversion_id UUID REFERENCES affiliate_conversions(id),
    
    -- Status
    status ENUM('pending', 'confirmed', 'rejected', 'refunded') DEFAULT 'pending',
    confirmed_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Customer Information
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    
    -- Product Information
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    product_category VARCHAR(100),
    
    converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_click_id (click_id),
    INDEX idx_member_id (member_id),
    INDEX idx_program_id (program_id),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_converted_at (converted_at),
    INDEX idx_parent_conversion (parent_conversion_id)
);
```

### 6. affiliate_payouts
Tracks commission payments to affiliates

```sql
CREATE TABLE affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES affiliate_members(id),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    
    -- Payout Information
    payout_reference VARCHAR(255) UNIQUE NOT NULL,
    total_conversions INT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    commission_amount DECIMAL(15,2) NOT NULL,
    fees DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    
    -- Payment Details
    payment_method ENUM('paypal', 'stripe', 'wire', 'check', 'crypto', 'bank') NOT NULL,
    payment_details JSON, -- varies by method
    transaction_id VARCHAR(255),
    
    -- Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    failure_reason TEXT,
    
    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_member_id (member_id),
    INDEX idx_program_id (program_id),
    INDEX idx_status (status),
    INDEX idx_period (period_start, period_end),
    INDEX idx_created_at (created_at)
);
```

### 7. affiliate_analytics
Aggregated analytics data

```sql
CREATE TABLE affiliate_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    member_id UUID REFERENCES affiliate_members(id), -- null for program-wide stats
    
    -- Period
    date DATE NOT NULL,
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    
    -- Metrics
    clicks INT DEFAULT 0,
    unique_clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    revenue DECIMAL(15,2) DEFAULT 0.00,
    commission DECIMAL(15,2) DEFAULT 0.00,
    
    -- Traffic Sources
    traffic_sources JSON,
    top_countries JSON,
    device_distribution JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    UNIQUE KEY unique_analytics (program_id, member_id, date, period_type),
    INDEX idx_program_id (program_id),
    INDEX idx_member_id (member_id),
    INDEX idx_date (date),
    INDEX idx_period_type (period_type)
);
```

### 8. affiliate_tiers
Defines commission tiers for programs

```sql
CREATE TABLE affiliate_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id),
    
    -- Tier Definition
    tier_name VARCHAR(100) NOT NULL,
    tier_level INT NOT NULL,
    
    -- Requirements
    min_conversions INT DEFAULT 0,
    min_revenue DECIMAL(15,2) DEFAULT 0.00,
    min_months_active INT DEFAULT 0,
    
    -- Commission Structure
    commission_type ENUM('percentage', 'fixed') NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    
    -- Benefits
    bonus_rate DECIMAL(5,2) DEFAULT 0.00,
    special_features JSON,
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_program_id (program_id),
    INDEX idx_tier_level (tier_level),
    UNIQUE KEY unique_tier_level (program_id, tier_level)
);
```

## API Endpoints Summary

### Program Management
- `POST /v1/affiliate` - Create new affiliate program
- `GET /v1/affiliate` - List affiliate programs
- `GET /v1/affiliate/:id` - Get program details
- `PUT /v1/affiliate/:id` - Update program
- `DELETE /v1/affiliate/:id` - Delete program
- `GET /v1/affiliate/my-affiliate` - Get user's programs

### Application & Membership
- `POST /v1/affiliate/apply` - Submit application
- `GET /v1/affiliate/applications` - List applications
- `PUT /v1/affiliate/applications/:id/approve` - Approve application
- `PUT /v1/affiliate/applications/:id/reject` - Reject application
- `POST /v1/affiliate/join-program` - Quick join (if auto-approved)

### Tracking & Analytics
- `POST /v1/affiliate/track-click` - Track link click
- `POST /v1/affiliate/track-conversion` - Track conversion
- `GET /v1/affiliate/referral-stats` - Get referral statistics
- `GET /v1/affiliate/earnings` - Get earnings data
- `GET /v1/affiliate/top-links` - Get top performing links
- `GET /v1/affiliate/analytics` - Get detailed analytics

### Payouts & Payments
- `GET /v1/affiliate/payouts` - List payouts
- `POST /v1/affiliate/payouts/request` - Request payout
- `GET /v1/affiliate/export-earnings` - Export earnings report

### Referral Management
- `GET /v1/affiliate/referral-link` - Get referral link
- `GET /v1/affiliate/my-referrals` - List referred users
- `GET /v1/affiliate/tier-info` - Get tier information

## Features Supported

1. **Program Posting**: Users can create detailed affiliate programs with custom commission structures
2. **Program Joining**: Multi-step application process with verification
3. **Link Tracking**: Comprehensive click and conversion tracking
4. **Commission Calculation**: Flexible commission structures including recurring commissions
5. **Tier System**: Multi-tier commission structures based on performance
6. **Analytics**: Detailed reporting and analytics
7. **Payout Management**: Automated payout processing
8. **Fraud Prevention**: IP tracking, fingerprinting, and validation

## Security Considerations

1. **Referral Code Generation**: Secure, non-guessable referral codes
2. **Click Fraud Detection**: IP-based limits and fingerprinting
3. **Conversion Validation**: Order ID verification and duplicate prevention
4. **Data Privacy**: GDPR-compliant data handling
5. **Access Control**: Role-based permissions for program management
