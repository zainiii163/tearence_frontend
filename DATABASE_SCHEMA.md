# Database Schema Documentation

This document outlines the required database schema updates for the job board platform with upsell features and monetization.

## Overview

The database schema needs to support:
- Job postings with upsell features (Featured, Suggested)
- Candidate profiles with upsell features (Featured Profile, Job Alerts Boost)
- Revenue tracking for paid upsells
- Analytics and reporting capabilities

---

## Tables

### 1. `jobs` (or `listings` - depending on your naming convention)

**Purpose**: Store job postings with all relevant details and upsell flags.

**Required Fields**:
```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    location_id INTEGER NOT NULL REFERENCES locations(id),
    country_id INTEGER REFERENCES countries(id),
    
    -- Job-specific fields
    job_type VARCHAR(50), -- 'full-time', 'part-time', 'contract', 'freelance', 'internship'
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    currency_id INTEGER REFERENCES currencies(id),
    apply_url TEXT,
    end_date DATE,
    
    -- Company information
    company_name VARCHAR(255),
    company_logo TEXT,
    
    -- Status and flags
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'expired', 'pending'
    is_featured BOOLEAN DEFAULT FALSE,
    is_suggested BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    is_promoted BOOLEAN DEFAULT FALSE,
    is_sponsored BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_location_id (location_id),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_suggested (is_suggested),
    INDEX idx_created_at (created_at)
);
```

**Notes**:
- `is_featured`: Set to true when a job has an active "Featured Job" upsell
- `is_suggested`: Set to true when a job has an active "Suggested Jobs" upsell
- `end_date`: When the job posting expires
- Soft delete support with `deleted_at`

---

### 2. `candidate_profiles`

**Purpose**: Store candidate profile information with visibility and upsell options.

**Required Fields**:
```sql
CREATE TABLE candidate_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Profile content
    headline VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    skills TEXT[], -- Array of skills, or JSON if using JSONB
    cv_url TEXT,
    location_id INTEGER REFERENCES locations(id),
    country_id INTEGER REFERENCES countries(id),
    
    -- Visibility settings
    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private'
    
    -- Upsell flags
    is_featured BOOLEAN DEFAULT FALSE,
    has_job_alerts_boost BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_visibility (visibility),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at)
);
```

**Notes**:
- `is_featured`: Set to true when a profile has an active "Featured Profile" upsell
- `has_job_alerts_boost`: Set to true when a profile has an active "Job Alerts Boost" upsell
- `skills`: Use PostgreSQL array type or JSONB for flexibility

---

### 3. `job_upsells`

**Purpose**: Track upsell purchases and status for job postings.

**Required Fields**:
```sql
CREATE TABLE job_upsells (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Upsell details
    upsell_type VARCHAR(50) NOT NULL, -- 'featured', 'suggested'
    price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    
    -- Payment information
    payment_id VARCHAR(255),
    payment_method VARCHAR(50), -- 'paypal', 'stripe', 'credit_card'
    payment_transaction_id VARCHAR(255),
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'expired', 'cancelled'
    activated_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_listing_id (listing_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_upsell_type (upsell_type),
    INDEX idx_expires_at (expires_at)
);
```

**Notes**:
- `expires_at`: Calculated as `activated_at + duration_days`
- Status transitions: `pending` → `active` (on payment) → `expired` (automatically)
- Multiple upsells can exist for the same job (e.g., both featured and suggested)

---

### 4. `candidate_upsells`

**Purpose**: Track upsell purchases and status for candidate profiles.

**Required Fields**:
```sql
CREATE TABLE candidate_upsells (
    id SERIAL PRIMARY KEY,
    candidate_profile_id INTEGER NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Upsell details
    upsell_type VARCHAR(50) NOT NULL, -- 'featured_profile', 'job_alerts_boost'
    price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    
    -- Payment information
    payment_id VARCHAR(255),
    payment_method VARCHAR(50), -- 'paypal', 'stripe', 'credit_card'
    payment_transaction_id VARCHAR(255),
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'expired', 'cancelled'
    activated_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_candidate_profile_id (candidate_profile_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_upsell_type (upsell_type),
    INDEX idx_expires_at (expires_at)
);
```

**Notes**:
- Similar structure to `job_upsells`
- Different upsell types: `featured_profile` and `job_alerts_boost`

---

### 5. `revenue_tracking`

**Purpose**: Track all revenue from upsells for analytics and reporting.

**Required Fields**:
```sql
CREATE TABLE revenue_tracking (
    id SERIAL PRIMARY KEY,
    
    -- Transaction details
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    payment_id VARCHAR(255),
    payment_transaction_id VARCHAR(255),
    
    -- Related entities
    user_id INTEGER NOT NULL REFERENCES users(id),
    listing_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
    candidate_profile_id INTEGER REFERENCES candidate_profiles(id) ON DELETE SET NULL,
    upsell_id INTEGER, -- Generic reference (could be job_upsells.id or candidate_upsells.id)
    upsell_type VARCHAR(50), -- 'job_upsell', 'candidate_upsell'
    
    -- Financial details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    
    -- Upsell specifics
    upsell_category VARCHAR(50), -- 'featured', 'suggested', 'featured_profile', 'job_alerts_boost'
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'refunded', 'failed'
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_listing_id (listing_id),
    INDEX idx_candidate_profile_id (candidate_profile_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_upsell_category (upsell_category)
);
```

**Notes**:
- Comprehensive tracking for all revenue streams
- Supports analytics queries by date, user, category, etc.
- Can be used for reporting and dashboard metrics

---

### 6. `payment_transactions` (Optional - if not using external payment service)

**Purpose**: Store payment transaction details if handling payments internally.

**Required Fields**:
```sql
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Payment details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    
    -- External payment provider info
    payment_provider VARCHAR(50), -- 'paypal', 'stripe', etc.
    provider_transaction_id VARCHAR(255),
    provider_response TEXT, -- JSON response from payment provider
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    
    -- Related entities
    related_type VARCHAR(50), -- 'job_upsell', 'candidate_upsell'
    related_id INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_provider_transaction_id (provider_transaction_id),
    INDEX idx_created_at (created_at)
);
```

---

## Relationships

### Entity Relationships:
```
users
 ├── jobs (one-to-many)
 ├── candidate_profiles (one-to-one)
 ├── job_upsells (one-to-many)
 ├── candidate_upsells (one-to-many)
 └── revenue_tracking (one-to-many)

jobs
 ├── job_upsells (one-to-many)
 └── revenue_tracking (one-to-many)

candidate_profiles
 ├── candidate_upsells (one-to-many)
 └── revenue_tracking (one-to-many)
```

---

## Indexes Summary

### Performance Optimization:
- All foreign keys are indexed
- Status fields are indexed for filtering
- Timestamp fields are indexed for sorting and date-range queries
- Upsell type fields are indexed for analytics
- User ID fields are indexed for user-specific queries

---

## Migration Scripts

### Example Migration (PostgreSQL):

```sql
-- Migration: Add upsell fields to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_suggested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS job_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS salary_min DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS salary_max DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS currency_id INTEGER REFERENCES currencies(id),
ADD COLUMN IF NOT EXISTS apply_url TEXT,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_is_suggested ON jobs(is_suggested);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_end_date ON jobs(end_date);

-- Create job_upsells table
CREATE TABLE IF NOT EXISTS job_upsells (
    -- ... (fields as defined above)
);

-- Create candidate_profiles table
CREATE TABLE IF NOT EXISTS candidate_profiles (
    -- ... (fields as defined above)
);

-- Create candidate_upsells table
CREATE TABLE IF NOT EXISTS candidate_upsells (
    -- ... (fields as defined above)
);

-- Create revenue_tracking table
CREATE TABLE IF NOT EXISTS revenue_tracking (
    -- ... (fields as defined above)
);
```

---

## Data Integrity

### Constraints:
1. **Foreign Key Constraints**: Ensure referential integrity
2. **Unique Constraints**: 
   - `users.id` in `candidate_profiles` (one profile per user)
   - `transaction_id` in `revenue_tracking`
3. **Check Constraints**: 
   - `duration_days > 0` in upsell tables
   - `amount > 0` in revenue tracking
   - Valid status values in enum-like checks

---

## Backend API Requirements

### Endpoints Needed:
1. **Job Upsells**:
   - `POST /v1/job-upsell` - Create job upsell
   - `GET /v1/job-upsell` - Get user's job upsells
   - `GET /v1/job-upsell/:id` - Get specific upsell
   - `POST /v1/job-upsell/:id/complete-payment` - Complete payment

2. **Candidate Upsells**:
   - `POST /v1/candidate-upsell` - Create candidate upsell
   - `GET /v1/candidate-upsell` - Get user's candidate upsells
   - `GET /v1/candidate-upsell/:id` - Get specific upsell
   - `POST /v1/candidate-upsell/:id/complete-payment` - Complete payment

3. **Analytics**:
   - `GET /v1/analytics/revenue` - Revenue analytics
   - `GET /v1/analytics/upsells` - Upsell performance
   - `GET /v1/analytics/jobs` - Job analytics
   - `GET /v1/analytics/candidates` - Candidate analytics

---

## Notes for Backend Implementation

1. **Automatic Expiration**: Create a scheduled job/cron to:
   - Update `status` from `active` to `expired` when `expires_at` passes
   - Update `is_featured`/`is_suggested` flags on jobs when upsells expire
   - Update `is_featured`/`has_job_alerts_boost` flags on profiles when upsells expire

2. **Payment Integration**: 
   - Store payment provider transaction IDs
   - Handle webhooks from payment providers (PayPal, Stripe, etc.)
   - Update upsell status when payment is confirmed

3. **Revenue Calculation**:
   - Sum all completed transactions from `revenue_tracking` where `status = 'completed'`
   - Group by date, category, user, etc. for analytics

4. **Soft Deletes**:
   - Use `deleted_at` for soft deletes where applicable
   - Filter out soft-deleted records in queries

---

## Future Enhancements

1. **Upsell Pricing Tiers**: Add a `pricing_tiers` table for dynamic pricing
2. **Discount Codes**: Add support for promotional codes
3. **Subscription Model**: Add recurring upsell subscriptions
4. **Analytics Aggregation**: Create materialized views for faster analytics queries

---

## Testing Checklist

- [ ] Job upsell creation and activation
- [ ] Candidate upsell creation and activation
- [ ] Payment processing and status updates
- [ ] Upsell expiration handling
- [ ] Revenue tracking accuracy
- [ ] Analytics queries performance
- [ ] Foreign key constraints
- [ ] Unique constraints
- [ ] Index performance
