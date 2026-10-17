/*
 * Site settings for debug.marian.online — the only file you need to edit.
 * Leave a value as "" until you have it; anything empty is simply skipped.
 */
window.SITE_CONFIG = {
  // Your Cal.com or Calendly event link, e.g.
  //   "https://cal.com/marian/debug-session"  or  "https://calendly.com/marian/debug-session"
  // In the booking tool, set the post-payment redirect to https://debug.marian.online/booked
  bookingUrl: "",

  // Ad pixels. Each loads on every page; /booked also sends a Purchase worth 149 USD.
  redditPixelId: "",   // e.g. "a2_abc123def456"
  metaPixelId: "",     // e.g. "1234567890123456"
  googleTagId: "",     // optional, e.g. "G-XXXXXXX" or "AW-XXXXXXXX"
  googleAdsConversionLabel: "", // optional, Google Ads only: "AW-XXXXXXXX/AbCdEf..."

  purchaseValue: 149,
  currency: "USD",

  // The 30-second Ep02 clip. Video ID is the part after watch?v= in the URL.
  ep02: { youtubeId: "", start: 0, end: 30 },

  // Build It in Go channel URL, used in the footer.
  channelUrl: ""
};
