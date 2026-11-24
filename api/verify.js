// GET /api/verify?reference=...  ->  { paid, status, name }
// Never returns the WhatsApp link; that only comes from /api/join as a redirect.
import { query, sendJson } from './_http.js'
import { checkPayment } from './_paystack.js'

export default async function handler(req, res) {
  try {
    const result = await checkPayment(query(req).get('reference'))
    return sendJson(res, 200, result)
  } catch (err) {
    console.error('Payment check failed:', err.message)
    return sendJson(res, 500, { error: "Couldn't check your payment right now. Please try again." })
  }
}
