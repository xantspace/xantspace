// GET /api/join?reference=...
// Re-checks the payment with Paystack, then forwards to the WhatsApp group.
// The group link is only ever sent as this redirect, never in the page's code.
import { query, redirect, sendJson } from './_http.js'
import { checkPayment } from './_paystack.js'

export default async function handler(req, res) {
  const reference = query(req).get('reference') || ''
  const groupLink = process.env.WHATSAPP_GROUP_LINK
  if (!groupLink) return sendJson(res, 500, { error: 'The WhatsApp group link is not set up yet.' })

  try {
    const { paid } = await checkPayment(reference)
    // Not paid: send them back to the welcome page, which explains what happened.
    if (!paid) return redirect(res, `/?reference=${encodeURIComponent(reference)}`)
    return redirect(res, groupLink)
  } catch (err) {
    console.error('Join check failed:', err.message)
    return sendJson(res, 500, { error: "Couldn't check your payment right now. Please try again." })
  }
}
