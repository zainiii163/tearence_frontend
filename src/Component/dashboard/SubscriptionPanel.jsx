import React, { useEffect, useState, useCallback } from 'react';
import { FaCheck, FaTimes, FaCrown, FaRocket, FaBuilding, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import subscriptionService from '../../services/SubscriptionService';
import { fetchStripeConfig } from '../../utils/stripeConfig';
import PaymentProcessor from '../Payment/PaymentProcessor';

const PLAN_ICONS = {
  basic: FaRocket,
  plus: FaCrown,
  business: FaBuilding,
};

const PLAN_COLORS = {
  basic: { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
  plus: { bg: '#f3e5f5', border: '#9c27b0', text: '#6a1b9a' },
  business: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
};

const SubscriptionPanel = () => {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [entitlements, setEntitlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [stripeConfig, setStripeConfig] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, statusRes, entitlementsRes] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getStatus().catch(() => ({ active: false })),
        subscriptionService.getEntitlements().catch(() => ({ entitlements: [] })),
      ]);
      setPlans(plansRes?.plans || []);
      setSubscription(statusRes?.subscription || null);
      setEntitlements(entitlementsRes?.entitlements || []);

      try {
        const config = await fetchStripeConfig();
        setStripeConfig(config);
      } catch {}
    } catch (e) {
      setError('Failed to load subscription data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    if (!selectedPlan) return;
    setPurchasing(selectedPlan.id);
    setError('');
    setMessage('');
    try {
      await subscriptionService.purchase(
        selectedPlan.id,
        paymentResult.paymentId,
        paymentResult.paymentMethod || 'stripe'
      );
      setMessage(`Successfully subscribed to ${selectedPlan.name}!`);
      setShowPayment(false);
      setSelectedPlan(null);
      await loadData();
    } catch (e) {
      setError(e?.message || 'Failed to activate subscription.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel? You can use remaining credits until the period ends.')) return;
    setPurchasing('cancel');
    setError('');
    setMessage('');
    try {
      const res = await subscriptionService.cancel();
      setMessage(res?.message || 'Subscription cancelled.');
      await loadData();
    } catch (e) {
      setError(e?.message || 'Failed to cancel subscription.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p>Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Subscriptions</h2>
        <p style={styles.subtitle}>Get monthly post credits and boost your presence on WWA</p>
      </div>

      {message && <div style={styles.successBanner}>{message}</div>}
      {error && <div style={styles.errorBanner}><FaExclamationTriangle /> {error}</div>}

      {/* Active Subscription Banner */}
      {subscription && (
        <div style={styles.activeBanner}>
          <div style={styles.activeBannerLeft}>
            <FaCrown style={{ color: '#f59e0b', marginRight: 12, fontSize: 24 }} />
            <div>
              <strong>{subscription.plan?.name} Plan</strong>
              <span style={{ marginLeft: 12, opacity: 0.8 }}>
                {subscription.days_remaining} days remaining
              </span>
            </div>
          </div>
          <div style={styles.activeBannerRight}>
            {subscription.status === 'active' && (
              <button
                style={styles.cancelBtn}
                onClick={handleCancel}
                disabled={purchasing === 'cancel'}
              >
                {purchasing === 'cancel' ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Entitlements Usage */}
      {entitlements.length > 0 && (
        <div style={styles.entitlementsSection}>
          <h3 style={styles.sectionTitle}>Your Credits This Month</h3>
          <div style={styles.entitlementsGrid}>
            {entitlements.map((ent) => (
              <div key={ent.type} style={styles.entitlementCard}>
                <div style={styles.entitlementType}>{ent.type.replace(/_/g, ' ')}</div>
                <div style={styles.entitlementBar}>
                  <div
                    style={{
                      ...styles.entitlementFill,
                      width: `${ent.total > 0 ? (ent.used / ent.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div style={styles.entitlementCounts}>
                  <span>{ent.used} used</span>
                  <strong>{ent.remaining} remaining</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div style={styles.plansGrid}>
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.slug] || FaRocket;
          const colors = PLAN_COLORS[plan.slug] || PLAN_COLORS.basic;
          const isActive = subscription?.plan?.slug === plan.slug && subscription?.status === 'active';

          return (
            <div
              key={plan.id}
              style={{
                ...styles.planCard,
                borderColor: isActive ? colors.border : '#e5e7eb',
                backgroundColor: isActive ? colors.bg : '#ffffff',
              }}
            >
              {isActive && (
                <div style={styles.activeBadge}>Active</div>
              )}
              <div style={{ ...styles.planIcon, backgroundColor: colors.border }}>
                <Icon size={28} color="#ffffff" />
              </div>
              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.planPrice}>
                <span style={styles.priceAmount}>${plan.price}</span>
                <span style={styles.pricePeriod}>/month</span>
              </div>
              <p style={styles.planDescription}>{plan.description}</p>

              <ul style={styles.featureList}>
                {plan.entitlements.paid_posts > 0 && (
                  <li style={styles.featureItem}>
                    <FaCheck style={styles.checkIcon} />
                    {plan.entitlements.paid_posts} Paid Post{plan.entitlements.paid_posts > 1 ? 's' : ''}
                  </li>
                )}
                {plan.entitlements.promoted_posts > 0 && (
                  <li style={styles.featureItem}>
                    <FaCheck style={styles.checkIcon} />
                    {plan.entitlements.promoted_posts} Promoted Post{plan.entitlements.promoted_posts > 1 ? 's' : ''}
                  </li>
                )}
                {plan.entitlements.featured_posts > 0 && (
                  <li style={styles.featureItem}>
                    <FaCheck style={styles.checkIcon} />
                    {plan.entitlements.featured_posts} Featured Post{plan.entitlements.featured_posts > 1 ? 's' : ''}
                  </li>
                )}
                {plan.entitlements.sponsored_posts > 0 && (
                  <li style={styles.featureItem}>
                    <FaCheck style={styles.checkIcon} />
                    {plan.entitlements.sponsored_posts} Sponsored Post{plan.entitlements.sponsored_posts > 1 ? 's' : ''}
                  </li>
                )}
                {plan.support_included && (
                  <li style={styles.featureItem}>
                    <FaCheck style={styles.checkIcon} /> Priority Support
                  </li>
                )}
                {plan.marketing_toolkit && (
                  <li style={styles.featureItem}>
                    <FaCheck style={styles.checkIcon} /> Marketing Toolkits
                  </li>
                )}
              </ul>

              <button
                style={{
                  ...styles.subscribeBtn,
                  backgroundColor: isActive ? '#9ca3af' : colors.border,
                  cursor: isActive ? 'default' : 'pointer',
                }}
                onClick={() => !isActive && handlePurchase(plan)}
                disabled={isActive || purchasing === plan.id}
              >
                {purchasing === plan.id ? (
                  <><FaSpinner style={{ marginRight: 8 }} /> Processing...</>
                ) : isActive ? (
                  'Current Plan'
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div style={styles.modalOverlay} onClick={() => { setShowPayment(false); setSelectedPlan(null); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => { setShowPayment(false); setSelectedPlan(null); }}>
              <FaTimes />
            </button>
            <h3 style={styles.modalTitle}>Subscribe to {selectedPlan.name}</h3>
            <p style={styles.modalAmount}>${selectedPlan.price} / month</p>
            <PaymentProcessor
              amount={selectedPlan.price}
              description={`WWA ${selectedPlan.name} Subscription - Monthly`}
              onSuccess={handlePaymentSuccess}
              onError={(err) => setError(err?.message || 'Payment failed.')}
              upsellType="subscription"
              upsellId={selectedPlan.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '0 0 40px' },
  header: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 700, color: '#1f2937', margin: 0 },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  loadingContainer: { textAlign: 'center', padding: 60, color: '#6b7280' },
  spinner: { fontSize: 32, color: '#3b82f6', animation: 'spin 1s linear infinite', marginBottom: 12 },
  successBanner: { padding: '12px 16px', borderRadius: 8, backgroundColor: '#d1fae5', color: '#065f46', marginBottom: 20, fontSize: 14 },
  errorBanner: { padding: '12px 16px', borderRadius: 8, backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 },
  activeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 12, backgroundColor: '#fef3c7', border: '1px solid #f59e0b', marginBottom: 32 },
  activeBannerLeft: { display: 'flex', alignItems: 'center', fontSize: 15 },
  activeBannerRight: { display: 'flex', gap: 8 },
  cancelBtn: { padding: '8px 16px', borderRadius: 8, border: '1px solid #dc2626', backgroundColor: '#ffffff', color: '#dc2626', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  entitlementsSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 16 },
  entitlementsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  entitlementCard: { padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
  entitlementType: { fontSize: 13, fontWeight: 600, color: '#374151', textTransform: 'capitalize', marginBottom: 8 },
  entitlementBar: { height: 8, borderRadius: 4, backgroundColor: '#e5e7eb', overflow: 'hidden', marginBottom: 6 },
  entitlementFill: { height: '100%', borderRadius: 4, backgroundColor: '#3b82f6', transition: 'width 0.3s ease' },
  entitlementCounts: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 },
  planCard: { position: 'relative', padding: 32, borderRadius: 16, border: '2px solid #e5e7eb', textAlign: 'center', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  activeBadge: { position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 20, backgroundColor: '#10b981', color: '#ffffff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' },
  planIcon: { width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  planName: { fontSize: 20, fontWeight: 700, color: '#1f2937', margin: '0 0 8px' },
  planPrice: { marginBottom: 12 },
  priceAmount: { fontSize: 36, fontWeight: 800, color: '#1f2937' },
  pricePeriod: { fontSize: 14, color: '#6b7280' },
  planDescription: { fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 20, minHeight: 40 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 24px', width: '100%', textAlign: 'left' },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 14, color: '#374151' },
  checkIcon: { color: '#10b981', fontSize: 14, flexShrink: 0 },
  subscribeBtn: { width: '100%', padding: '12px 24px', borderRadius: 10, border: 'none', color: '#ffffff', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { position: 'relative', backgroundColor: '#ffffff', borderRadius: 16, padding: 32, maxWidth: 500, width: '90%', maxHeight: '90vh', overflow: 'auto' },
  modalClose: { position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 4 },
  modalAmount: { fontSize: 24, fontWeight: 800, color: '#3b82f6', marginBottom: 24 },
};

export default SubscriptionPanel;
