// Small helpers shared by the API endpoints. Files starting with "_" are not endpoints on Vercel.

export function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function redirect(res, location) {
  res.statusCode = 302
  res.setHeader('Location', location)
  res.setHeader('Cache-Control', 'no-store')
  res.end()
}

export function query(req) {
  return new URL(req.url, 'http://localhost').searchParams
}

export async function readJson(req) {
  // Vercel parses JSON bodies for us; the local dev server doesn't.
  if (req.body && typeof req.body === 'object') return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

/** The public address of the site, used as Paystack's return address. */
export function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || 'http'
  return `${proto}://${req.headers.host}`
}
