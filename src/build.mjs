// Builds the static site into ./dist  —  run: npm run build
import { mkdir, rm, cp, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, cities, lanes, plantCities, officeCities, fieldCities, locales } from "./content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
// Search engines are blocked unless SITE_LIVE=1 is set at build time (set it only when going live).
const LIVE = process.env.SITE_LIVE === "1";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------- icons ---------- */
const ICON_PATHS = {
  fuel: '<path d="M12 2.5c.6 3.2 5 5.4 5 10a5 5 0 0 1-10 0c0-2.3 1.2-3.8 2.4-4.8.1 1.6.9 2.6 2 2.9-.6-2.8-.2-5.6.6-8.1Z"/>',
  truck: '<path d="M2.5 6.5h11v10h-11zM13.5 9.5h4l3 3v4h-7z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  boxes: '<rect x="3" y="11" width="8" height="8" rx="1"/><rect x="13" y="11" width="8" height="8" rx="1"/><rect x="8" y="3" width="8" height="8" rx="1"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
  doc: '<path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"/>',
  team: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.6 14.2A5 5 0 0 1 21 19"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  pin: '<path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  wa: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.7Z"/><path d="M9 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.5.3-1.2.5-1.9.3-2.6-.7-4.7-2.8-5.4-5.4-.2-.7 0-1.4.3-1.9Z"/>',
  check: '<path d="m5 12.5 4 4 10-10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  plant: '<path d="M3 21V11l5 3v-3l5 3V7h3l.8-3h2.4l.8 3v14Z"/><path d="M3 21h18"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
};
const icon = (name, cls = "") =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;

/* ---------- network map ---------- */
function networkMap(t) {
  const k = 34;
  const used = Object.entries(cities);
  const lons = used.map(([, c]) => c.lon);
  const lats = used.map(([, c]) => c.lat);
  const padX = 92, padTop = 36, padBottom = 30;
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const W = Math.round((maxLon - minLon) * k + padX * 2);
  const H = Math.round((maxLat - minLat) * k + padTop + padBottom);
  const P = (c) => [padX + (c.lon - minLon) * k, padTop + (maxLat - c.lat) * k];

  let paths = "", movers = "";
  lanes.forEach(([a, b, weight], i) => {
    const [x1, y1] = P(cities[a]);
    const [x2, y2] = P(cities[b]);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const bend = (i % 2 ? 1 : -1) * Math.min(0.22 * len, 46);
    const cx = mx - (dy / len) * bend, cy = my + (dx / len) * bend;
    const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    paths += `<path class="lane w${weight}" d="${d}"/>`;
    const dur = (3.2 + len / 70).toFixed(1);
    for (let n = 0; n < weight; n++) {
      movers += `<circle class="mover" r="2.6"><animateMotion dur="${dur}s" begin="${(-(n * dur) / weight - i * 0.37).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`;
    }
  });

  let dots = "";
  const labelled = new Set();
  const label = (key, c, x, y, cls) => {
    if (!c.label || labelled.has(key)) return "";
    labelled.add(key);
    const [dx, dy, anchor] = c.label;
    return `<text class="lbl ${cls}" x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">${esc(c[t.lang])}</text>`;
  };
  for (const [key, c] of used) {
    const [x, y] = P(c);
    if (officeCities.includes(key)) {
      dots += `<circle class="pulse" cx="${x}" cy="${y}" r="7"/><circle class="office" cx="${x}" cy="${y}" r="6.5"/>`;
      dots += label(key, c, x, y, "lbl-strong");
    } else if (plantCities.includes(key)) {
      dots += `<circle class="plant" cx="${x}" cy="${y}" r="5"/>`;
      dots += label(key, c, x, y, "lbl-strong");
    } else if (fieldCities.includes(key)) {
      dots += `<circle class="field" cx="${x}" cy="${y}" r="6"/><circle class="src" cx="${x}" cy="${y}" r="2.6"/>`;
      dots += label(key, c, x, y, "");
    } else {
      dots += `<circle class="src" cx="${x}" cy="${y}" r="3"/>`;
      dots += label(key, c, x, y, "");
    }
  }

  return `<svg class="netmap" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t.hero.mapCaption)}">
  <defs><pattern id="dots-${t.lang}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.2" class="gridDot"/></pattern></defs>
  <rect width="${W}" height="${H}" fill="url(#dots-${t.lang})"/>
  <g>${paths}</g><g>${movers}</g><g>${dots}</g>
</svg>`;
}

/* ---------- JSON-LD ---------- */
function jsonLd() {
  const en = locales.find((l) => l.lang === "en");
  const branches = en.branches.items.map((b) => ({
    "@type": "LocalBusiness",
    name: `${site.brand} — ${b.name}`,
    telephone: b.phone[0].replace(/\s/g, ""),
    email: b.email,
    address: { "@type": "PostalAddress", streetAddress: b.address, addressRegion: b.state, addressCountry: "IN" },
    parentOrganization: { "@id": `${site.domain}/#org` },
  }));
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.domain}/#org`,
        name: site.brand,
        alternateName: ["Transjit Express", "TRANS-JIT EXPRESS"],
        url: site.domain,
        logo: `${site.domain}/assets/logo-original.jpg`,
        foundingDate: String(site.founded),
        email: site.email,
        telephone: site.primaryPhone.replace(/\s/g, ""),
        slogan: "Let your success ride with us",
        areaServed: "IN",
      },
      ...branches,
    ],
  });
}

/* ---------- page ---------- */
function page(t) {
  const other = locales.find((l) => l !== t);
  const waBase = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t.contact.waIntro)}`;
  const year = new Date().getFullYear();

  const header = `
<div class="progress" aria-hidden="true"></div>
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="hdr" id="top">
  <div class="wrap hdr-in">
    <a class="brand" href="${t.path}" aria-label="${esc(site.brand)}">
      <img class="brand-mark" src="/assets/mark.jpg" alt="" width="190" height="415">
      <img class="brand-word" src="/assets/wordmark.jpg" alt="${esc(site.brand)} — Let your success ride with us" width="980" height="215">
    </a>
    <nav class="nav" id="nav" aria-label="Main">
      ${t.nav.map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join("")}
      <a class="nav-cta-m btn btn-primary" href="#contact">${esc(t.cta)}</a>
    </nav>
    <div class="hdr-actions">
      <a class="lang" href="${other.path}" hreflang="${other.htmlLang}" lang="${other.htmlLang}" aria-label="${esc(other.otherLabel === "English" ? "हिंदी" : "English")}">${icon("globe")}<span>${esc(t.otherLabel)}</span></a>
      <a class="btn btn-primary btn-sm hdr-cta" href="#contact">${esc(t.cta)}</a>
      <button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="Menu">${icon("menu", "i-open")}${icon("close", "i-close")}</button>
    </div>
  </div>
</header>`;

  const hero = `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow eyebrow-light">${esc(t.hero.eyebrow)}</p>
      <h1>${t.hero.title.map((l, i) => `<span${i === t.hero.title.length - 1 ? ' class="hl"' : ""}>${esc(l)}</span>`).join(" ")}</h1>
      <p class="hero-lead">${esc(t.hero.lead)}</p>
      <div class="hero-ctas">
        <a class="btn btn-cyan" href="${waBase}" target="_blank" rel="noopener">${icon("wa")}${esc(t.hero.primary)}</a>
        <a class="btn btn-ghost" href="${site.primaryPhoneHref}">${icon("phone")}${esc(t.hero.secondary)} · ${esc(site.primaryPhone)}</a>
      </div>
    </div>
    <figure class="hero-map">
      <div class="map-card">
        ${networkMap(t)}
        <div class="legend">
          <span><i class="lg lg-plant"></i>${esc(t.hero.legendPlant)}</span>
          <span><i class="lg lg-office"></i>${esc(t.hero.legendOffice)}</span>
          <span><i class="lg lg-field"></i>${esc(t.hero.legendField)}</span>
        </div>
        <p class="north">↑ ${esc(t.hero.north)}</p>
      </div>
      <figcaption>${esc(t.hero.mapCaption)}</figcaption>
    </figure>
  </div>
</section>`;

  const stats = `
<section class="stats-wrap" aria-label="Key numbers">
  <div class="wrap">
    <div class="stats">
      ${t.stats.items
        .map(
          ([n, suf, l]) =>
            `<div class="stat"><p class="stat-n"><span class="count" data-to="${n}" data-plain="${n === 2012 ? 1 : 0}">${n === 2012 ? n : n.toLocaleString("en-IN")}</span>${suf}</p><p class="stat-l">${esc(l)}</p></div>`
        )
        .join("")}
    </div>
    <p class="stats-note">${esc(t.stats.note)}</p>
    <div class="clients">
      <p class="clients-l">${esc(t.clients.label)}</p>
      <div class="marquee"><div class="marquee-track">${[0, 1].map((k) => `<ul class="clients-list"${k ? ' aria-hidden="true"' : ""}>${t.clients.names.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`).join("")}</div></div>
    </div>
  </div>
</section>`;

  const about = `
<section class="sec" id="about">
  <div class="wrap about">
    <div class="reveal">
      <p class="eyebrow">${esc(t.about.eyebrow)}</p>
      <h2>${esc(t.about.title)}</h2>
      ${t.about.body.map((p) => `<p class="body-l">${esc(p)}</p>`).join("")}
    </div>
    <ul class="points">
      ${t.about.points
        .map(
          ([h, p], i) =>
            `<li class="point glow reveal" style="--d:${i * 80}ms"><span class="point-i">${icon("check")}</span><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></li>`
        )
        .join("")}
    </ul>
  </div>
</section>`;

  const services = `
<section class="sec sec-soft" id="services">
  <div class="wrap">
    <div class="sec-head reveal">
      <p class="eyebrow">${esc(t.services.eyebrow)}</p>
      <h2>${esc(t.services.title)}</h2>
      <p class="body-l">${esc(t.services.lead)}</p>
    </div>
    <div class="bento">
      ${t.services.items
        .map(
          ([ic, h, p, featured], i) =>
            `<article class="svc glow reveal${featured ? " svc-feat" : ""}${i === t.services.items.length - 1 ? " svc-wide" : ""}" style="--d:${(i % 4) * 70}ms">
              <span class="svc-i">${icon(ic)}</span>
              <h3>${esc(h)}</h3>
              <p>${esc(p)}</p>
              ${featured ? `<ul class="tags">${t.services.tags.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
            </article>`
        )
        .join("")}
    </div>
  </div>
</section>`;

  const network = `
<section class="sec" id="network">
  <div class="wrap">
    <div class="sec-head reveal">
      <p class="eyebrow">${esc(t.network.eyebrow)}</p>
      <h2>${esc(t.network.title)}</h2>
      <p class="body-l">${esc(t.network.lead)}</p>
    </div>
    <div class="lanes">
      ${t.network.groups
        .map(
          ([to, plant, froms], i) => `
        <article class="lane-card glow reveal" style="--d:${(i % 3) * 70}ms">
          <div class="lane-to"><span class="lane-ic">${icon("plant")}</span><div><p class="lane-k">${esc(t.network.toLabel)}</p><h3>${esc(to)}</h3><p class="lane-plant">${esc(plant)}</p></div></div>
          <p class="lane-k">${esc(t.network.fromLabel)}</p>
          <ul class="chips">${froms.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        </article>`
        )
        .join("")}
      <a class="lane-card lane-more reveal" href="#contact"><span>${icon("globe")}</span><h3>${esc(t.network.more)}</h3><span class="more-arrow">${icon("arrow")}</span></a>
    </div>
  </div>
</section>`;

  const process = `
<section class="sec sec-dark" id="process">
  <div class="wrap">
    <div class="sec-head reveal">
      <p class="eyebrow eyebrow-light">${esc(t.process.eyebrow)}</p>
      <h2>${esc(t.process.title)}</h2>
    </div>
    <ol class="steps">
      ${t.process.steps
        .map(
          ([h, p], i) =>
            `<li class="step glow reveal" style="--d:${(i % 3) * 80}ms"><span class="step-n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`
        )
        .join("")}
    </ol>
  </div>
</section>`;

  const branches = `
<section class="sec" id="branches">
  <div class="wrap">
    <div class="sec-head reveal">
      <p class="eyebrow">${esc(t.branches.eyebrow)}</p>
      <h2>${esc(t.branches.title)}</h2>
    </div>
    <div class="branches">
      ${t.branches.items
        .map(
          (b, i) => `
        <article class="branch glow reveal" style="--d:${i * 80}ms" id="branch-${b.key}">
          <div class="branch-photo" aria-hidden="true">
            <img src="/assets/mark.jpg" alt="" width="190" height="415">
            <span>${esc(t.branches.photoSoon)}</span>
          </div>
          <div class="branch-body">
            <p class="branch-tag">${esc(b.tag)}</p>
            <h3>${esc(b.name)}</h3>
            <p class="branch-state">${esc(b.state)}</p>
            ${b.note ? `<p class="branch-note">${esc(b.note)}</p>` : ""}
            <ul class="branch-info">
              <li>${icon("pin")}<span>${esc(b.address)}</span></li>
              ${t.branches.hours ? `<li>${icon("clock")}<span>${esc(t.branches.hours)}</span></li>` : ""}
              <li>${icon("phone")}<a href="${b.phone[1]}">${esc(b.phone[0])}</a></li>
              <li>${icon("mail")}<a href="mailto:${b.email}">${esc(b.email)}</a></li>
            </ul>
            <div class="branch-btns">
              <a class="btn btn-outline btn-sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.maps)}" target="_blank" rel="noopener">${icon("pin")}${esc(t.branches.directions)}</a>
              <a class="btn btn-primary btn-sm" href="${b.phone[1]}">${icon("phone")}${esc(t.branches.call)}</a>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>
    <div class="field reveal">
      <div><h3>${esc(t.branches.fieldTitle)}</h3><p>${esc(t.branches.fieldBody)}</p></div>
      <ul class="chips chips-lg">${t.branches.fieldCities.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </div>
  </div>
</section>`;

  const f = t.contact.fields;
  const contact = `
<section class="sec sec-soft" id="contact">
  <div class="wrap contact">
    <div class="contact-side reveal">
      <p class="eyebrow eyebrow-light">${esc(t.contact.eyebrow)}</p>
      <h2>${esc(t.contact.title)}</h2>
      <p class="contact-lead">${esc(t.contact.lead)}</p>
      <p class="direct-l">${esc(t.contact.direct)}</p>
      <ul class="direct">
        <li><a href="${site.primaryPhoneHref}">${icon("phone")}<span><small>${esc(t.contact.callLabel)}</small>${esc(site.primaryPhone)}</span></a></li>
        <li><a href="${waBase}" target="_blank" rel="noopener">${icon("wa")}<span><small>${esc(t.contact.waLabel)}</small>${esc(site.primaryPhone)}</span></a></li>
        <li><a href="mailto:${site.email}">${icon("mail")}<span><small>${esc(t.contact.mailLabel)}</small>${esc(site.email)}</span></a></li>
      </ul>
    </div>
    <form class="quote reveal" id="quote" novalidate data-wa="${site.whatsapp}" data-intro="${esc(t.contact.waIntro)}" data-required="${esc(t.contact.required)}">
      <div class="row2">
        <label>${esc(f.name)} *<input name="name" autocomplete="name" required></label>
        <label>${esc(f.phone)} *<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required></label>
      </div>
      <label>${esc(f.company)}<input name="company" autocomplete="organization"></label>
      <div class="row2">
        <label>${esc(f.from)}<input name="from"></label>
        <label>${esc(f.to)}<input name="to"></label>
      </div>
      <div class="row2">
        <label>${esc(f.material)}<select name="material"><option value=""></option>${t.contact.materials.map((m) => `<option>${esc(m)}</option>`).join("")}</select></label>
        <label>${esc(f.qty)}<input name="qty"></label>
      </div>
      <label>${esc(f.message)}<textarea name="message" rows="3"></textarea></label>
      <p class="form-err" role="alert" hidden></p>
      <button class="btn btn-primary btn-block" type="submit">${icon("wa")}${esc(t.contact.submit)}</button>
      <p class="form-note">${esc(t.contact.privacy)}</p>
    </form>
  </div>
</section>`;

  const footer = `
<footer class="ftr">
  <div class="wrap ftr-in">
    <div class="ftr-brand">
      <div class="ftr-logo"><img src="/assets/mark.jpg" alt="" width="190" height="415"><img src="/assets/wordmark.jpg" alt="${esc(site.brand)}" width="980" height="215"></div>
      <p>${esc(t.footer.about)}</p>
    </div>
    <div>
      <p class="ftr-h">${esc(t.footer.quick)}</p>
      <ul>${t.nav.map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join("")}<li><a href="${other.path}" hreflang="${other.htmlLang}">${esc(t.otherLabel)}</a></li></ul>
    </div>
    <div>
      <p class="ftr-h">${esc(t.footer.reach)}</p>
      <ul>
        <li><a href="${site.primaryPhoneHref}">${esc(site.primaryPhone)}</a></li>
        <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
        <li>${esc(t.footer.gst)}: ${esc(site.gstin)}</li>
      </ul>
    </div>
  </div>
  <div class="wrap ftr-base"><p>© ${year} ${esc(site.brand)}. ${esc(t.footer.rights)}</p><p class="ftr-tag">${esc(t.footer.tagline)}</p></div>
</footer>
<a class="fab" href="${waBase}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("wa")}</a>`;

  return `<!doctype html>
<html lang="${t.htmlLang}" data-lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
${LIVE ? "" : '<meta name="robots" content="noindex, nofollow">'}
<link rel="canonical" href="${site.domain}${t.path}">
${locales.map((l) => `<link rel="alternate" hreflang="${l.htmlLang}" href="${site.domain}${l.path}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${site.domain}/">
<meta name="theme-color" content="#1b1650">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:url" content="${site.domain}${t.path}">
<meta property="og:image" content="${site.domain}/assets/logo-original.jpg">
<meta property="og:locale" content="${t.htmlLang.replace("-", "_")}">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Mukta:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${jsonLd()}</script>
</head>
<body>
${header}
<main id="main">
${hero}
${stats}
${about}
${services}
${network}
${process}
${branches}
${contact}
</main>
${footer}
<script src="/main.js" defer></script>
</body>
</html>`;
}

/* ---------- write ---------- */
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "public"), dist, { recursive: true });
await cp(join(root, "src", "styles.css"), join(dist, "styles.css"));
await cp(join(root, "src", "main.js"), join(dist, "main.js"));
for (const t of locales) {
  const out = join(dist, t.path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page(t));
}
const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locales
    .map((l) => `  <url><loc>${site.domain}${l.path}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);
await writeFile(join(dist, "robots.txt"), LIVE ? `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n");
console.log("Built", locales.map((l) => l.path).join(", "), "→ dist/", LIVE ? "(LIVE: search engines allowed)" : "(preview: hidden from search engines)");
