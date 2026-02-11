/**
 * Commission Calculator and Payment Tracking System
 * Handles complex commission calculations, tier management, and payment processing
 */

class CommissionCalculator {
  constructor() {
    this.tiers = new Map();
    this.commissionRules = new Map();
    this.paymentHistory = [];
    this.pendingPayouts = new Map();
  }

  /**
   * Register commission tiers for a program
   */
  registerTiers(programId, tiers) {
    this.tiers.set(programId, tiers);
  }

  /**
   * Register commission rules for a program
   */
  registerCommissionRules(programId, rules) {
    this.commissionRules.set(programId, rules);
  }

  /**
   * Calculate commission for a single conversion
   */
  calculateCommission(programId, conversionData, memberData) {
    const rules = this.commissionRules.get(programId);
    const tiers = this.tiers.get(programId);
    
    if (!rules) {
      throw new Error(`No commission rules found for program ${programId}`);
    }

    let commission = 0;
    let commissionDetails = {
      baseCommission: 0,
      tierBonus: 0,
      performanceBonus: 0,
      recurringCommission: 0,
      totalCommission: 0,
      calculationBreakdown: []
    };

    // Base commission calculation
    const baseCommission = this.calculateBaseCommission(rules, conversionData);
    commissionDetails.baseCommission = baseCommission;
    commissionDetails.calculationBreakdown.push({
      type: 'base',
      description: 'Base commission',
      amount: baseCommission,
      formula: this.getCommissionFormula(rules, conversionData)
    });

    // Tier-based bonus
    if (tiers && memberData.tier) {
      const tierBonus = this.calculateTierBonus(tiers, memberData.tier, baseCommission);
      commissionDetails.tierBonus = tierBonus;
      if (tierBonus > 0) {
        commissionDetails.calculationBreakdown.push({
          type: 'tier_bonus',
          description: `${memberData.tier} tier bonus`,
          amount: tierBonus,
          formula: `${baseCommission} * ${tiers.find(t => t.name === memberData.tier)?.bonusRate || 0}%`
        });
      }
    }

    // Performance bonus
    const performanceBonus = this.calculatePerformanceBonus(rules, memberData, conversionData);
    commissionDetails.performanceBonus = performanceBonus;
    if (performanceBonus > 0) {
      commissionDetails.calculationBreakdown.push({
        type: 'performance_bonus',
        description: 'Performance bonus',
        amount: performanceBonus,
        formula: 'Based on conversion volume and value'
      });
    }

    // Recurring commission
    if (conversionData.isRecurring) {
      const recurringCommission = this.calculateRecurringCommission(rules, conversionData);
      commissionDetails.recurringCommission = recurringCommission;
      commissionDetails.calculationBreakdown.push({
        type: 'recurring',
        description: `Recurring commission (period ${conversionData.recurringPeriod})`,
        amount: recurringCommission,
        formula: this.getRecurringCommissionFormula(rules, conversionData)
      });
    }

    // Calculate total commission
    commissionDetails.totalCommission = 
      commissionDetails.baseCommission +
      commissionDetails.tierBonus +
      commissionDetails.performanceBonus +
      commissionDetails.recurringCommission;

    // Apply maximum commission cap if set
    if (rules.maxCommissionPerConversion) {
      commissionDetails.totalCommission = Math.min(
        commissionDetails.totalCommission,
        rules.maxCommissionPerConversion
      );
      commissionDetails.calculationBreakdown.push({
        type: 'cap',
        description: 'Maximum commission cap applied',
        amount: commissionDetails.totalCommission,
        formula: `Min(${commissionDetails.totalCommission}, ${rules.maxCommissionPerConversion})`
      });
    }

    return commissionDetails;
  }

  /**
   * Calculate base commission
   */
  calculateBaseCommission(rules, conversionData) {
    const { commissionType, commissionRate, commissionValue } = rules;
    
    switch (commissionType) {
      case 'percentage':
        return (conversionData.amount * commissionRate) / 100;
      case 'fixed':
        return commissionValue;
      case 'tiered_percentage':
        return this.calculateTieredPercentage(rules, conversionData.amount);
      case 'tiered_fixed':
        return this.calculateTieredFixed(rules, conversionData.amount);
      default:
        throw new Error(`Unknown commission type: ${commissionType}`);
    }
  }

  /**
   * Calculate tiered percentage commission
   */
  calculateTieredPercentage(rules, amount) {
    const tiers = rules.tieredRates || [];
    let commission = 0;
    let remainingAmount = amount;

    for (const tier of tiers.sort((a, b) => a.minAmount - b.minAmount)) {
      if (remainingAmount <= 0) break;
      
      if (amount >= tier.minAmount) {
        const tierMax = tier.maxAmount || Infinity;
        const tierAmount = Math.min(remainingAmount, tierMax - tier.minAmount + 1);
        commission += (tierAmount * tier.rate) / 100;
        remainingAmount -= tierAmount;
      }
    }

    return commission;
  }

  /**
   * Calculate tiered fixed commission
   */
  calculateTieredFixed(rules, amount) {
    const tiers = rules.tieredRates || [];
    
    for (const tier of tiers.sort((a, b) => b.minAmount - a.minAmount)) {
      if (amount >= tier.minAmount) {
        return tier.rate;
      }
    }
    
    return 0;
  }

  /**
   * Calculate tier bonus
   */
  calculateTierBonus(tiers, memberTier, baseCommission) {
    const tier = tiers.find(t => t.name === memberTier);
    if (!tier || !tier.bonusRate) return 0;
    
    return (baseCommission * tier.bonusRate) / 100;
  }

  /**
   * Calculate performance bonus
   */
  calculatePerformanceBonus(rules, memberData, conversionData) {
    let bonus = 0;
    const performanceRules = rules.performanceBonuses || [];

    for (const rule of performanceRules) {
      if (this.meetsPerformanceCriteria(rule, memberData, conversionData)) {
        bonus += rule.bonusAmount || 0;
      }
    }

    return bonus;
  }

  /**
   * Check if performance criteria are met
   */
  meetsPerformanceCriteria(rule, memberData, conversionData) {
    if (rule.minConversions && memberData.totalConversions < rule.minConversions) {
      return false;
    }
    
    if (rule.minRevenue && memberData.totalRevenue < rule.minRevenue) {
      return false;
    }
    
    if (rule.conversionValue && conversionData.amount < rule.conversionValue) {
      return false;
    }
    
    if (rule.productCategory && conversionData.productCategory !== rule.productCategory) {
      return false;
    }

    return true;
  }

  /**
   * Calculate recurring commission
   */
  calculateRecurringCommission(rules, conversionData) {
    const recurringRules = rules.recurringCommission || {};
    if (!recurringRules.enabled) return 0;

    const { commissionType, commissionRate, commissionValue, maxPeriods } = recurringRules;
    
    if (maxPeriods && conversionData.recurringPeriod > maxPeriods) {
      return 0;
    }

    switch (commissionType) {
      case 'percentage':
        return (conversionData.amount * commissionRate) / 100;
      case 'fixed':
        return commissionValue;
      case 'percentage_of_original':
        return (conversionData.originalAmount * commissionRate) / 100;
      default:
        return 0;
    }
  }

  /**
   * Get commission formula description
   */
  getCommissionFormula(rules, conversionData) {
    const { commissionType, commissionRate, commissionValue } = rules;
    
    switch (commissionType) {
      case 'percentage':
        return `${conversionData.amount} × ${commissionRate}%`;
      case 'fixed':
        return `$${commissionValue} (fixed)`;
      default:
        return 'Custom calculation';
    }
  }

  /**
   * Get recurring commission formula description
   */
  getRecurringCommissionFormula(rules, conversionData) {
    const recurringRules = rules.recurringCommission || {};
    const { commissionType, commissionRate, commissionValue } = recurringRules;
    
    switch (commissionType) {
      case 'percentage':
        return `${conversionData.amount} × ${commissionRate}% (recurring)`;
      case 'fixed':
        return `$${commissionValue} (recurring fixed)`;
      case 'percentage_of_original':
        return `${conversionData.originalAmount} × ${commissionRate}% (of original)`;
      default:
        return 'Custom recurring calculation';
    }
  }

  /**
   * Calculate member's tier based on performance
   */
  calculateMemberTier(programId, memberStats) {
    const tiers = this.tiers.get(programId);
    if (!tiers) return 'basic';

    // Sort tiers by level (highest first)
    const sortedTiers = tiers.sort((a, b) => b.level - a.level);

    for (const tier of sortedTiers) {
      if (memberStats.totalConversions >= tier.minConversions &&
          memberStats.totalRevenue >= tier.minRevenue &&
          memberStats.monthsActive >= tier.minMonthsActive) {
        return tier.name;
      }
    }

    return 'basic';
  }

  /**
   * Calculate pending payout for a member
   */
  calculatePendingPayout(memberId, programId, conversions, rules) {
    const pendingConversions = conversions.filter(c => c.status === 'confirmed' && !c.paid);
    let totalCommission = 0;
    let commissionBreakdown = [];

    for (const conversion of pendingConversions) {
      const commissionDetails = this.calculateCommission(programId, conversion, conversion.member);
      totalCommission += commissionDetails.totalCommission;
      commissionBreakdown.push({
        conversionId: conversion.id,
        commission: commissionDetails,
        date: conversion.date
      });
    }

    // Apply fees
    const fees = this.calculateFees(totalCommission, rules.paymentFees || {});
    const netAmount = totalCommission - fees;

    return {
      memberId,
      programId,
      totalConversions: pendingConversions.length,
      totalCommission,
      fees,
      netAmount,
      commissionBreakdown,
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate payment fees
   */
  calculateFees(amount, feeRules) {
    let totalFees = 0;

    // Fixed fee
    if (feeRules.fixedFee) {
      totalFees += feeRules.fixedFee;
    }

    // Percentage fee
    if (feeRules.percentageFee) {
      totalFees += (amount * feeRules.percentageFee) / 100;
    }

    // Processing fee
    if (feeRules.processingFee) {
      totalFees += feeRules.processingFee;
    }

    // Minimum fee
    if (feeRules.minFee && totalFees < feeRules.minFee) {
      totalFees = feeRules.minFee;
    }

    // Maximum fee
    if (feeRules.maxFee && totalFees > feeRules.maxFee) {
      totalFees = feeRules.maxFee;
    }

    return totalFees;
  }

  /**
   * Generate payout report
   */
  generatePayoutReport(programId, periodStart, periodEnd, members) {
    const report = {
      programId,
      periodStart,
      periodEnd,
      generatedAt: new Date().toISOString(),
      summary: {
        totalMembers: members.length,
        totalConversions: 0,
        totalCommission: 0,
        totalFees: 0,
        totalPayout: 0,
        averageCommissionPerMember: 0
      },
      memberPayouts: []
    };

    for (const member of members) {
      const memberConversions = member.conversions.filter(c => 
        c.date >= periodStart && c.date <= periodEnd && c.status === 'confirmed'
      );

      if (memberConversions.length === 0) continue;

      const payout = this.calculatePendingPayout(member.id, programId, memberConversions, member.programRules);
      
      report.memberPayouts.push({
        memberId: member.id,
        memberName: member.name,
        memberEmail: member.email,
        memberTier: member.tier,
        ...payout
      });

      // Update summary
      report.summary.totalConversions += payout.totalConversions;
      report.summary.totalCommission += payout.totalCommission;
      report.summary.totalFees += payout.fees;
      report.summary.totalPayout += payout.netAmount;
    }

    // Calculate averages
    if (report.summary.totalMembers > 0) {
      report.summary.averageCommissionPerMember = report.summary.totalCommission / report.summary.totalMembers;
    }

    return report;
  }

  /**
   * Validate commission calculation
   */
  validateCommission(commissionDetails, rules) {
    const errors = [];

    // Check for negative commissions
    if (commissionDetails.totalCommission < 0) {
      errors.push('Total commission cannot be negative');
    }

    // Check commission caps
    if (rules.maxCommissionPerConversion && 
        commissionDetails.totalCommission > rules.maxCommissionPerConversion) {
      errors.push(`Commission exceeds maximum of ${rules.maxCommissionPerConversion}`);
    }

    // Check minimum commission
    if (rules.minCommissionPerConversion && 
        commissionDetails.totalCommission < rules.minCommissionPerConversion) {
      errors.push(`Commission below minimum of ${rules.minCommissionPerConversion}`);
    }

    // Validate calculation breakdown
    const calculatedTotal = 
      commissionDetails.baseCommission +
      commissionDetails.tierBonus +
      commissionDetails.performanceBonus +
      commissionDetails.recurringCommission;

    if (Math.abs(calculatedTotal - commissionDetails.totalCommission) > 0.01) {
      errors.push('Commission calculation breakdown does not match total');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get commission statistics
   */
  getCommissionStats(programId, conversions, members) {
    const stats = {
      totalConversions: conversions.length,
      totalCommission: 0,
      averageCommission: 0,
      medianCommission: 0,
      highestCommission: 0,
      lowestCommission: Infinity,
      commissionByTier: new Map(),
      commissionByMonth: new Map(),
      conversionRate: 0,
      recurringCommissions: 0,
      oneTimeCommissions: 0
    };

    const commissions = [];

    for (const conversion of conversions) {
      const commissionDetails = this.calculateCommission(programId, conversion, conversion.member);
      commissions.push(commissionDetails.totalCommission);
      stats.totalCommission += commissionDetails.totalCommission;

      // Track by tier
      const tier = conversion.member.tier || 'basic';
      if (!stats.commissionByTier.has(tier)) {
        stats.commissionByTier.set(tier, { count: 0, total: 0 });
      }
      const tierStats = stats.commissionByTier.get(tier);
      tierStats.count++;
      tierStats.total += commissionDetails.totalCommission;

      // Track by month
      const month = conversion.date.substring(0, 7); // YYYY-MM
      if (!stats.commissionByMonth.has(month)) {
        stats.commissionByMonth.set(month, { count: 0, total: 0 });
      }
      const monthStats = stats.commissionByMonth.get(month);
      monthStats.count++;
      monthStats.total += commissionDetails.totalCommission;

      // Track recurring vs one-time
      if (conversion.isRecurring) {
        stats.recurringCommissions += commissionDetails.totalCommission;
      } else {
        stats.oneTimeCommissions += commissionDetails.totalCommission;
      }

      // Update highest/lowest
      stats.highestCommission = Math.max(stats.highestCommission, commissionDetails.totalCommission);
      stats.lowestCommission = Math.min(stats.lowestCommission, commissionDetails.totalCommission);
    }

    // Calculate averages and medians
    if (commissions.length > 0) {
      stats.averageCommission = stats.totalCommission / commissions.length;
      commissions.sort((a, b) => a - b);
      stats.medianCommission = commissions[Math.floor(commissions.length / 2)];
    }

    if (stats.lowestCommission === Infinity) {
      stats.lowestCommission = 0;
    }

    // Calculate conversion rate
    const totalClicks = members.reduce((sum, member) => sum + (member.totalClicks || 0), 0);
    stats.conversionRate = totalClicks > 0 ? (stats.totalConversions / totalClicks) * 100 : 0;

    return stats;
  }
}

// Create singleton instance
const commissionCalculator = new CommissionCalculator();

export default commissionCalculator;
