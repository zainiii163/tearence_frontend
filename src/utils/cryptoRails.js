/**
 * Phase 1 crypto rails: NOWPayments + USDT/USDC + external user wallets.
 * WWA does not custody crypto. Wrong-network sends can be permanently lost.
 */

export const CRYPTO_PROVIDER = 'nowpayments';

export const PHASE1_PAY_CURRENCIES = ['usdttrc20', 'usdterc20', 'usdcmatic', 'usdc'];

export const PAY_CURRENCY_META = {
  usdttrc20: {
    label: 'USDT (TRC20)',
    currency: 'USDT',
    network: 'TRC20',
    networkId: 'trc20',
    explorer: 'https://tronscan.org/#/transaction/',
    addressHint: 'Starts with T (Tron)',
  },
  usdterc20: {
    label: 'USDT (ERC20)',
    currency: 'USDT',
    network: 'ERC20',
    networkId: 'erc20',
    explorer: 'https://etherscan.io/tx/',
    addressHint: 'Starts with 0x (Ethereum)',
  },
  usdcmatic: {
    label: 'USDC (Polygon)',
    currency: 'USDC',
    network: 'Polygon',
    networkId: 'polygon',
    explorer: 'https://polygonscan.com/tx/',
    addressHint: 'Starts with 0x (Polygon)',
  },
  usdc: {
    label: 'USDC',
    currency: 'USDC',
    network: 'USDC',
    networkId: 'usdc',
    explorer: '',
    addressHint: 'Confirm network with the recipient',
  },
  btc: {
    label: 'Bitcoin',
    currency: 'BTC',
    network: 'Bitcoin',
    networkId: 'btc',
    explorer: 'https://mempool.space/tx/',
    addressHint: 'Bitcoin address',
  },
  eth: {
    label: 'Ethereum',
    currency: 'ETH',
    network: 'ERC20',
    networkId: 'eth',
    explorer: 'https://etherscan.io/tx/',
    addressHint: 'Starts with 0x (Ethereum)',
  },
};

export const PAYOUT_NETWORKS = [
  {
    id: 'trc20',
    currency: 'USDT',
    label: 'USDT → TRC20',
    payCurrency: 'usdttrc20',
    example: 'TXXXXXXXX',
  },
  {
    id: 'erc20',
    currency: 'USDT',
    label: 'USDT → ERC20',
    payCurrency: 'usdterc20',
    example: '0x…',
  },
  {
    id: 'polygon',
    currency: 'USDC',
    label: 'USDC → Polygon',
    payCurrency: 'usdcmatic',
    example: '0x…',
  },
];

export const NETWORK_MISMATCH_WARNING =
  'Wallet address and network must match. Sending crypto on the wrong network can result in permanent loss of funds. WWA cannot reverse on-chain transfers.';

export function getPayCurrencyMeta(code) {
  const key = String(code || '').toLowerCase();
  return PAY_CURRENCY_META[key] || {
    label: String(code || '').toUpperCase(),
    currency: String(code || '').toUpperCase(),
    network: String(code || '').toUpperCase(),
    networkId: key,
    explorer: '',
    addressHint: 'Confirm the network before sending',
  };
}

export function labelPayCurrency(code) {
  return getPayCurrencyMeta(code).label;
}

export function preferPhase1Currencies(list) {
  const incoming = Array.isArray(list) ? list.map((c) => String(c).toLowerCase()) : [];
  const preferred = PHASE1_PAY_CURRENCIES.filter((c) => incoming.includes(c));
  if (preferred.length) return preferred;
  if (incoming.length) return incoming;
  return [...PHASE1_PAY_CURRENCIES];
}

export function isCompletedCryptoStatus(status) {
  const s = String(status || '').toLowerCase();
  return ['finished', 'confirmed', 'completed', 'paid', 'success'].includes(s);
}

export function extractTxHash(payload) {
  if (!payload || typeof payload !== 'object') return '';
  return String(
    payload.tx_hash ||
      payload.payin_hash ||
      payload.payout_hash ||
      payload.hash ||
      payload.transaction_hash ||
      payload.txid ||
      payload.details?.tx_hash ||
      payload.details?.payin_hash ||
      ''
  ).trim();
}

export function explorerUrlFor(payCurrency, txHash) {
  const hash = String(txHash || '').trim();
  if (!hash) return '';
  const meta = getPayCurrencyMeta(payCurrency);
  return meta.explorer ? `${meta.explorer}${hash}` : '';
}

const TRON_ADDRESS = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export function validateCryptoAddress(address, networkId) {
  const value = String(address || '').trim();
  if (!value) {
    return { ok: false, message: 'Enter a wallet address.' };
  }
  const net = String(networkId || '').toLowerCase();
  if (net === 'trc20') {
    if (!TRON_ADDRESS.test(value)) {
      return {
        ok: false,
        message: 'TRC20 addresses start with T and are 34 characters (e.g. TXXXXXXXX).',
      };
    }
    return { ok: true, address: value };
  }
  if (net === 'erc20' || net === 'polygon' || net === 'eth' || net === 'usdc') {
    if (!EVM_ADDRESS.test(value)) {
      return {
        ok: false,
        message: 'This network needs a 0x Ethereum-style address (42 characters).',
      };
    }
    return { ok: true, address: value };
  }
  if (value.length < 20) {
    return { ok: false, message: 'Wallet address looks too short.' };
  }
  return { ok: true, address: value };
}

export function payoutNetworkById(networkId) {
  return PAYOUT_NETWORKS.find((n) => n.id === networkId) || PAYOUT_NETWORKS[0];
}

export default {
  CRYPTO_PROVIDER,
  PHASE1_PAY_CURRENCIES,
  PAYOUT_NETWORKS,
  NETWORK_MISMATCH_WARNING,
  getPayCurrencyMeta,
  labelPayCurrency,
  preferPhase1Currencies,
  isCompletedCryptoStatus,
  extractTxHash,
  explorerUrlFor,
  validateCryptoAddress,
  payoutNetworkById,
};
