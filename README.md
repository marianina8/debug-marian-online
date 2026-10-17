# debug.marian.online

Landing page for the $149 Debug Session. Plain static HTML + CSS, no build step, deployed on Vercel.

| Path | File | Notes |
|---|---|---|
| `/` | `index.html` | Landing page (indexable) |
| `/booked` | `booked/index.html` | Post-payment thank-you; fires Purchase 149 USD; `noindex` |
| `/privacy` | `privacy/index.html` | Privacy policy for the ad pixels |

## Settings
Edit **`assets/config.js`** only: booking link, Reddit/Meta pixel IDs, optional Google tag, Ep02 YouTube ID + start time, channel URL. Empty values are skipped.

The booking tool must redirect to `https://debug.marian.online/booked` after payment.

## Local preview
`python3 -m http.server 8000` then open http://localhost:8000
