import api from '../api';

/**
 * Super-admin category money flow (Clive ledger).
 */
export async function fetchCategoryMoneySummary(params = {}) {
  const { data } = await api.get('/admin/category-money/summary', { params });
  return data?.data || data;
}

export async function fetchCategoryMoneyLedger(params = {}) {
  const { data } = await api.get('/admin/category-money/ledger', { params });
  return data?.data || data;
}

export default {
  fetchCategoryMoneySummary,
  fetchCategoryMoneyLedger,
};
