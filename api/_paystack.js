// Server-only Paystack helpers. The secret key never reaches the browser.

/** ₦30,000 in kobo. Keep in sync with PRICE in src/content.js (that one is only for display). */
export const PRICE_KOBO = 30000 * 100

const API = 'https://api.paystack.co'
const REFERENCE_RE = /^[A-Za-z0-9_.=-]{1,100}$/

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set')
  return key
}

export async function paystack(path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.status) throw new Error(data?.message || `Paystack error ${res.status}`)
  return data.data
}

/**
 * Asks Paystack whether this payment went through for the full price.
 * Returns { paid, status, name }. status is Paystack's ("success", "abandoned", "ongoing", ...).
 */
export async function checkPayment(reference) {
  secretKey() // fail loudly if the server isn't configured
  if (!reference || !REFERENCE_RE.test(reference)) return { paid: false, status: 'invalid', name: '' }

  let tx
  try {
    tx = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`)
  } catch {
    return { paid: false, status: 'not_found', name: '' }
  }

  const paid = tx.status === 'success' && tx.currency === 'NGN' && tx.amount >= PRICE_KOBO
  return { paid, status: tx.status, name: tx.metadata?.name ?? '' }
}
