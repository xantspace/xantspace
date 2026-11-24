// Browser side of the payment flow. All the secret parts live in /api on the server.

async function readError(res, fallback) {
  const data = await res.json().catch(() => ({}))
  return new Error(data.error || fallback)
}

/** Creates the Paystack payment. Returns { payUrl, reference }. */
export async function startPayment(values) {
  const res = await fetch('/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!res.ok) throw await readError(res, 'Something went wrong. Please try again.')
  return res.json()
}

/** Asks the server whether this payment went through. Returns { paid, status, name }. */
export async function checkPayment(reference) {
  const res = await fetch(`/api/verify?reference=${encodeURIComponent(reference)}`)
  if (!res.ok) throw await readError(res, "Couldn't check your payment right now.")
  return res.json()
}

/** A link to our own server, which forwards paid students to the WhatsApp group. */
export const joinUrl = (reference) => `/api/join?reference=${encodeURIComponent(reference)}`
