// Page copy and settings. Replace the [BRACKETED] placeholders before launch.

export const PRICE = '₦30,000'
// Display only. The amount actually charged is PRICE_KOBO in api/_paystack.js; keep them matching.
// Every pay button on the landing page goes to signup first; signup then opens Paystack.
export const SIGNUP_HREF = '#/signup'

// Marketing video for the top of the page. Put the file in the `public/` folder
// (e.g. public/marketing.mp4) and set src to '/marketing.mp4'.
// poster is an optional still image shown before the video loads.
// While src is empty, a placeholder card is shown instead.
export const HERO_VIDEO = {
  src: '/xant-promo.MP4',
  poster: '',
}

export const features = [
  {
    title: 'Host listings',
    body: 'Owners upload apartments with photos, prices and amenities. Guests browse them on the site.',
  },
  {
    title: 'Bookings',
    body: 'Guests pick dates, the app works out the price, and the booking is saved.',
  },
  {
    title: 'Paystack payments',
    body: 'Real checkout with Paystack, and payment checks done the proper way so nobody books for free.',
  },
  {
    title: 'Dashboards',
    body: 'Guests see paid bookings and extend their stay. Hosts see bookings and earnings.',
  },
]

export const sessions = [
  {
    title: 'Setup and planning',
    body: 'Tools, GitHub and your AI builder installed. You plan the app with AI and leave with it running on your laptop.',
  },
  {
    title: 'Database and login',
    body: 'Users, listings and bookings stored properly. Sign up and log in for guests and hosts.',
  },
  {
    title: 'Listings',
    body: 'Hosts create listings with photos. A public page shows every shortlet, each with its own page.',
  },
  {
    title: 'Booking and Paystack',
    body: 'Pick dates, pay with Paystack, confirm the payment. This is the session people remember.',
  },
  {
    title: 'Dashboards and go live',
    body: 'Guest and host dashboards, then deploy with a real link.',
  },
]

export const schedule =
  'Dates: Monday 7 December to Friday 11 December. Time: 9 PM sharp (WAT), about 2 hours per session. All sessions recorded.'

export const requirements = [
  "A laptop. A phone won't do it.",
  'Stable internet for live sessions.',
  'No coding experience needed. Just be ready to show up and build.',
]

export const faqs = [
  {
    q: "I've never coded before. Can I do this?",
    a: 'Yes. The AI writes most of the code. I teach you how to direct it, read what it writes and fix it when it gets things wrong.',
  },
  {
    q: 'Is it live or recorded?',
    a: 'Live. Every session is also recorded, so you can catch up or rewatch.',
  },
  {
    q: 'What if I get stuck?',
    a: "Drop it in the group. There's help in the chat during sessions so nobody gets left behind.",
  },
  {
    q: 'Can I sell the app after?',
    a: "Yes. It's your app, so you're free to sell it to shortlet and apartment owners.",
  },
]
