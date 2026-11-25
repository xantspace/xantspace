import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.jsx'
import SignupPage from './SignupPage.jsx'
import WelcomePage from './WelcomePage.jsx'
import BonusPage from './BonusPage.jsx'

// Minimal hash routing: "#/signup" shows the signup page, anything else the landing page.
function Root() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const isSignup = hash === '#/signup'
  const isBonus = hash === '#/bonus'

  useEffect(() => {
    // After switching pages, jump to the in-page anchor (e.g. #pay) or the top.
    const target = !hash.startsWith('#/') && hash.length > 1 && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash])

  // Paystack sends people back to "/?reference=..." after paying.
  const reference = new URLSearchParams(window.location.search).get('reference')
  if (reference) return <WelcomePage reference={reference} />

  if (isSignup) return <SignupPage />
  if (isBonus) return <BonusPage />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Skips spring motion for people who turned on "reduce motion" in their OS */}
    <MotionConfig reducedMotion="user">
      <Root />
    </MotionConfig>
  </StrictMode>,
)
