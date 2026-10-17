/* debug.marian.online — pixels, booking embed, Ep02 clip. Settings live in config.js. */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var page = document.documentElement.getAttribute("data-page") || "home";

  function has(v) { return typeof v === "string" && v.trim() !== ""; }
  function store(get, key, val) {
    try { return get ? sessionStorage.getItem(key) : sessionStorage.setItem(key, val); } catch (e) { return null; }
  }

  /* ---------- Pixels ---------- */
  if (has(C.metaPixelId)) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", C.metaPixelId);
    fbq("track", "PageView");
  }
  if (has(C.redditPixelId)) {
    !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};
    p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js";t.async=!0;
    var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
    rdt("init", C.redditPixelId);
    rdt("track", "PageVisit");
  }
  if (has(C.googleTagId)) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.googleTagId);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", C.googleTagId);
  }

  /* ---------- Purchase on /booked (once per booking) ---------- */
  if (page === "booked") {
    var q = new URLSearchParams(location.search);
    var bookingId = q.get("invitee_uuid") || q.get("uid") || q.get("bookingId") || q.get("id") ||
      ("b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    var last = parseInt(store(true, "dbg_purchase_at") || "0", 10);
    // Skip if this tab already counted a purchase in the last 10 minutes (reloads, double redirects).
    if (!last || Date.now() - last > 10 * 60 * 1000) {
      store(false, "dbg_purchase_at", String(Date.now()));
      var value = C.purchaseValue || 149, currency = C.currency || "USD";
      if (window.fbq) fbq("track", "Purchase", { value: value, currency: currency }, { eventID: bookingId });
      if (window.rdt) rdt("track", "Purchase", { value: value, currency: currency, itemCount: 1, conversionId: bookingId });
      if (window.gtag) {
        gtag("event", "purchase", { transaction_id: bookingId, value: value, currency: currency,
          items: [{ item_name: "Debug Session", price: value, quantity: 1 }] });
        if (has(C.googleAdsConversionLabel)) {
          gtag("event", "conversion", { send_to: C.googleAdsConversionLabel, value: value, currency: currency, transaction_id: bookingId });
        }
      }
    }
  }

  function onReady(fn) {
    if (document.readyState !== "loading") fn(); else document.addEventListener("DOMContentLoaded", fn);
  }

  onReady(function () {
    /* ---------- Footer channel link ---------- */
    if (has(C.channelUrl)) {
      document.querySelectorAll("[data-channel-link]").forEach(function (a) { a.href = C.channelUrl; });
    }

    /* ---------- Ep02 clip ---------- */
    var clip = document.getElementById("ep02-clip");
    if (clip && C.ep02 && has(C.ep02.youtubeId)) {
      var src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(C.ep02.youtubeId) +
        "?rel=0&modestbranding=1&start=" + (C.ep02.start | 0) + (C.ep02.end > 0 ? "&end=" + (C.ep02.end | 0) : "");
      clip.innerHTML = '<iframe src="' + src + '" title="Build It in Go, Ep02: the cleanest code was the most broken" ' +
        'loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      clip.classList.add("is-video");
      if (C.ep02.vertical) clip.classList.add("is-vertical");
    }

    /* ---------- Booking embed ---------- */
    var mount = document.getElementById("booking-embed");
    if (!mount) return;
    var url = (C.bookingUrl || "").trim();
    if (!url) return; // the static fallback note stays visible

    var host = "";
    try { host = new URL(url).hostname; } catch (e) { return; }
    mount.innerHTML = "";
    mount.classList.add("is-live");
    var target = document.createElement("div");
    target.id = "booking-target";
    mount.appendChild(target);

    if (/calendly\.com$/.test(host)) {
      target.className = "calendly-inline-widget";
      var u = new URL(url);
      u.searchParams.set("hide_gdpr_banner", "1");
      u.searchParams.set("primary_color", "b4c46a");
      target.setAttribute("data-url", u.toString());
      var s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
      // Backup for the redirect: when Calendly reports a scheduled (paid) event, go to /booked.
      window.addEventListener("message", function (e) {
        if (e.origin === "https://calendly.com" && e.data && e.data.event === "calendly.event_scheduled") {
          setTimeout(function () { if (location.pathname.indexOf("/booked") !== 0) location.href = "/booked"; }, 1500);
        }
      });
    } else if (/(^|\.)cal\.com$/.test(host) || /(^|\.)cal\.eu$/.test(host)) {
      (function (C2, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C2.document;
        C2.Cal = C2.Cal || function () { var cal = C2.Cal; var ar = arguments;
          if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
          if (ar[0] === L) { var api = function () { p(api, arguments); }; var ns = ar[1]; api.q = api.q || [];
            if (typeof ns === "string") { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], ar); p(cal, ["initNamespace", ns]); } else p(cal, ar); return; }
          p(cal, ar); };
      })(window, "https://app.cal.com/embed/embed.js", "init");
      var calLink = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
      Cal("init", "debug", { origin: "https://" + host });
      Cal.ns.debug("inline", { elementOrSelector: "#booking-target", calLink: calLink, layout: "month_view" });
      // Cal.com's free plan has no post-booking redirect, so the page sends people to /booked itself.
      var goBooked = function (e) {
        var d = (e && e.detail && e.detail.data) || {};
        var uid = d.uid || (d.booking && d.booking.uid) || "";
        if (location.pathname.indexOf("/booked") !== 0) location.href = "/booked" + (uid ? "?uid=" + encodeURIComponent(uid) : "");
      };
      Cal.ns.debug("on", { action: "bookingSuccessfulV2", callback: goBooked });
      Cal.ns.debug("on", { action: "bookingSuccessful", callback: goBooked });
      Cal.ns.debug("ui", { theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#1a2638" } }, hideEventTypeDetails: false });
    } else {
      // Any other booking page: plain iframe.
      var f = document.createElement("iframe");
      f.src = url;
      f.title = "Book a Debug Session";
      f.loading = "lazy";
      target.appendChild(f);
    }

    // Every "Book" button opens the booking widget section.
    document.querySelectorAll("[data-book]").forEach(function (a) { a.setAttribute("href", "#book"); });
  });
})();
