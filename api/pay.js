// POST /api/pay  { name, email, phone }  ->  { payUrl, reference }
// Starts a ₦30,000 Paystack payment and returns the checkout page to send the visitor to.
import { readJson, sendJson, siteUrl } from './_http.js'
import { PRICE_KOBO, paystack } from './_paystack.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })

  const body = await readJson(req)
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const digits = phone.replace(/[^\d]/g, '')

  if (name.length < 2 || name.length > 100) return sendJson(res, 400, { error: 'Enter your full name.' })
  if (!EMAIL_RE.test(email) || email.length > 200) return sendJson(res, 400, { error: 'Enter a valid email address.' })
  if (digits.length < 10 || digits.length > 14) return sendJson(res, 400, { error: 'Enter a valid WhatsApp number.' })

  try {
    const tx = await paystack('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: PRICE_KOBO,
        currency: 'NGN',
        // Paystack sends them back here with ?reference=... added.
        callback_url: `${siteUrl(req)}/`,
        metadata: {
          name,
          phone,
          custom_fields: [
            { display_name: 'Full name', variable_name: 'full_name', value: name },
            { display_name: 'WhatsApp number', variable_name: 'whatsapp', value: phone },
          ],
        },
      }),
    })
    return sendJson(res, 200, { payUrl: tx.authorization_url, reference: tx.reference })
  } catch (err) {
    console.error('Paystack initialize failed:', err.message)
    return sendJson(res, 502, { error: "Couldn't start the payment. Please try again." })
  }
}
