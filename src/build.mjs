// Builds the static site into ./dist  —  run: npm run build
import { mkdir, rm, cp, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, cities, lanes, plantCities, officeCities, fieldCities, locales } from "./content.mjs";
import { pages, routes, routeGroups, officeSlug, leaders } from "./pages.mjs";

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

/* ---------- shared labels ---------- */
const LBL = {
  en: { home: "Home", pages: "Services & locations", branch: "Branch details", rdf: "Learn about RDF transport", routes: "See all routes", from: "From", to: "To", plants: "Plants", material: "Material", faq: "Frequently asked questions", ctaH: "Need trucks for this route?", ctaP: "Send your loading point, destination and quantity — we reply with a rate and truck availability.", hours: "Mon–Sat, 9:30 am – 6:30 pm", team: "Meet our leadership team", cofounders: "Co-founders", cofoundersLead: "Trans-Jit Express was started in 2012 by three co-founders who share the leadership of the company, each heading a key part of the business.", ourTeam: "Our team" },
  hi: { home: "होम", pages: "सेवाएँ और ब्रांच", branch: "ब्रांच की पूरी जानकारी", rdf: "RDF ट्रांसपोर्ट के बारे में", routes: "सभी रूट देखें", from: "कहाँ से", to: "कहाँ तक", plants: "प्लांट", material: "मटीरियल", faq: "अक्सर पूछे जाने वाले सवाल", ctaH: "इस रूट के लिए गाड़ी चाहिए?", ctaP: "लोडिंग पॉइंट, मंज़िल और मात्रा भेजें — हम रेट और गाड़ी की उपलब्धता बताएँगे।", hours: "सोम–शनि, सुबह 9:30 – शाम 6:30", team: "हमारी लीडरशिप टीम से मिलिए", cofounders: "सह-संस्थापक", cofoundersLead: "ट्रांस-जीत एक्सप्रेस की शुरुआत 2012 में तीन सह-संस्थापकों ने की, जो मिलकर कंपनी चलाते हैं — हर एक कारोबार का एक अहम हिस्सा संभालता है।", ourTeam: "हमारी टीम" },
};
const li = (t) => (t.lang === "hi" ? 1 : 0);
const pagePath = (t, slug) => `${t.path}${slug}/`;
const waLink = (t) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t.contact.waIntro)}`;

/* ---------- JSON-LD ---------- */
const OPENING = [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "18:30" }];
function orgLd() {
  const en = locales.find((l) => l.lang === "en");
  const branches = en.branches.items.map((b) => ({
    "@type": "LocalBusiness",
    "@id": `${site.domain}/${officeSlug[b.key]}/#branch`,
    name: `${site.brand} — ${b.name}`,
    url: `${site.domain}/${officeSlug[b.key]}/`,
    image: `${site.domain}/assets/og-image.jpg`,
    logo: `${site.domain}/assets/logo-original.jpg`,
    telephone: b.phone[0].replace(/\s/g, ""),
    email: b.email,
    address: { "@type": "PostalAddress", streetAddress: b.address, addressRegion: b.state, addressCountry: "IN" },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.maps)}`,
    openingHoursSpecification: OPENING,
    areaServed: "IN",
    knowsAbout: ["RDF transport", "Co-processing waste logistics", "Full truck load transport", "Alternative fuel logistics for cement plants"],
    parentOrganization: { "@id": `${site.domain}/#org` },
  }));
  return [
    {
      "@type": "Organization",
      "@id": `${site.domain}/#org`,
      name: site.brand,
      alternateName: ["Transjit Express", "TRANS-JIT EXPRESS", "Trans Jit Express"],
      url: `${site.domain}/`,
      logo: `${site.domain}/assets/logo-original.jpg`,
      image: `${site.domain}/assets/og-image.jpg`,
      foundingDate: String(site.founded),
      email: site.email,
      telephone: site.primaryPhone.replace(/\s/g, ""),
      slogan: "Let your success ride with us",
      areaServed: "IN",
      taxID: site.gstin,
      founder: leaders.filter((l) => l.founder).map((l) => ({ "@type": "Person", name: l.name[0], jobTitle: l.role[0] })),
      employee: leaders.map((l) => ({ "@type": "Person", name: l.name[0], jobTitle: l.role[0] })),
      description: en.meta.description,
    },
    { "@type": "WebSite", "@id": `${site.domain}/#website`, url: `${site.domain}/`, name: site.brand, publisher: { "@id": `${site.domain}/#org` }, inLanguage: ["en-IN", "hi-IN"] },
    ...branches,
  ];
}
const faqLd = (items) => ({ "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const crumbLd = (items) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.domain}${url}` })) });

/* ---------- shared header / footer / document ---------- */
function headerHtml(t, ctx) {
  const link = (h) => (ctx.home ? h : `${t.path}${h}`);
  const otherLabel = t.otherLabel;
  return `
<div class="progress" aria-hidden="true"></div>
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="hdr" id="top">
  <div class="wrap hdr-in">
    <a class="brand" href="${t.path}" aria-label="${esc(site.brand)} — ${esc(LBL[t.lang].home)}">
      <img class="brand-mark" src="/assets/mark.jpg" alt="" width="190" height="415">
      <img class="brand-word" src="/assets/wordmark.jpg" alt="${esc(site.brand)} — Let your success ride with us" width="980" height="215">
    </a>
    <nav class="nav" id="nav" aria-label="Main">
      ${t.nav.map(([h, l]) => `<a href="${link(h)}">${esc(l)}</a>`).join("")}
      <a class="nav-cta-m btn btn-primary" href="${link("#contact")}">${esc(t.cta)}</a>
    </nav>
    <div class="hdr-actions">
      <a class="lang" href="${ctx.alt}" hreflang="${ctx.altLang}" lang="${ctx.altLang}">${icon("globe")}<span>${esc(otherLabel)}</span></a>
      <a class="btn btn-primary btn-sm hdr-cta" href="${link("#contact")}">${esc(t.cta)}</a>
      <button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="Menu">${icon("menu", "i-open")}${icon("close", "i-close")}</button>
    </div>
  </div>
</header>`;
}

function footerHtml(t, ctx) {
  const link = (h) => (ctx.home ? h : `${t.path}${h}`);
  const year = new Date().getFullYear();
  const pageLinks = pages.map((pg) => `<li><a href="${pagePath(t, pg.slug)}">${esc(pg[t.lang].crumb)}</a></li>`).join("");
  return `
<footer class="ftr">
  <div class="wrap ftr-in">
    <div class="ftr-brand">
      <div class="ftr-logo"><img src="/assets/mark.jpg" alt="" width="190" height="415"><img src="/assets/wordmark.jpg" alt="${esc(site.brand)}" width="980" height="215"></div>
      <p>${esc(t.footer.about)}</p>
    </div>
    <div>
      <p class="ftr-h">${esc(t.footer.quick)}</p>
      <ul>${t.nav.map(([h, l]) => `<li><a href="${link(h)}">${esc(l)}</a></li>`).join("")}<li><a href="${ctx.alt}" hreflang="${ctx.altLang}">${esc(t.otherLabel)}</a></li></ul>
    </div>
    <div>
      <p class="ftr-h">${esc(LBL[t.lang].pages)}</p>
      <ul>${pageLinks}</ul>
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
<a class="fab" href="${waLink(t)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("wa")}</a>`;
}

function docHtml(t, ctx, meta, body, ld) {
  const url = `${site.domain}${ctx.path}`;
  return `<!doctype html>
<html lang="${t.htmlLang}" data-lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
${LIVE ? '<meta name="robots" content="index, follow, max-image-preview:large">' : '<meta name="robots" content="noindex, nofollow">'}
<link rel="canonical" href="${url}">
${ctx.alternates.map(([lang, path]) => `<link rel="alternate" hreflang="${lang}" href="${site.domain}${path}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${site.domain}${ctx.alternates.find(([l]) => l === "en-IN")[1]}">
<meta name="theme-color" content="#1b1650">
<meta name="geo.region" content="IN">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.domain}/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.htmlLang.replace("-", "_")}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Mukta:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [...orgLd(), ...ld] })}</script>
</head>
<body${ctx.home ? "" : ' class="subpage"'}>
${headerHtml(t, ctx)}
<main id="main">
${body}
</main>
${footerHtml(t, ctx)}
<script src="/main.js" defer></script>
</body>
</html>
<!-- build ${(process.env.GITHUB_SHA || "local").slice(0, 7)} -->`;
}

function faqHtml(t, items, title, eyebrow) {
  return `
<section class="sec" id="faq">
  <div class="wrap faq-wrap">
    <div class="sec-head reveal">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
      <h2>${esc(title)}</h2>
    </div>
    <div class="faq">
      ${items.map(([q, a], i) => `<details class="faq-item reveal"${i === 0 ? " open" : ""}><summary><h3>${esc(q)}</h3><span class="faq-i" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join("")}
    </div>
  </div>
</section>`;
}

function officeCard(t, key, withLink) {
  const b = t.branches.items.find((x) => x.key === key);
  return `
        <article class="branch glow reveal" id="branch-${b.key}">
          <div class="branch-photo" aria-hidden="true">
            <img src="/assets/mark.jpg" alt="" width="190" height="415">
            <span>${esc(t.branches.photoSoon)}</span>
          </div>
          <div class="branch-body">
            <p class="branch-tag">${esc(b.tag)}</p>
            <h3>${esc(site.brand)} — ${esc(b.name)}</h3>
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
            ${withLink ? `<a class="more-link" href="${pagePath(t, officeSlug[b.key])}">${esc(LBL[t.lang].branch)} ${icon("arrow")}</a>` : ""}
          </div>
        </article>`;
}

function routesHtml(t, opts) {
  const L = LBL[t.lang];
  let list = routes.filter((r) => !opts.hub || r.hub === opts.hub);
  if (opts.limit) list = list.slice(0, opts.limit);
  const row = (r) => `<li class="route glow reveal">
      <h3><span>${esc(r.from[li(t)])}</span> ${icon("arrow")} <span>${esc(r.to[li(t)])}</span></h3>
      <p class="route-meta"><span><b>${esc(L.plants)}:</b> ${esc(r.plants)}</span><span><b>${esc(L.material)}:</b> ${esc(r.mat[li(t)])}</span></p>
    </li>`;
  if (opts.limit || opts.hub) return `<ul class="routes">${list.map(row).join("")}</ul>`;
  return Object.entries(routeGroups)
    .map(([hub, name]) => `<h3 class="route-group">${esc(name[li(t)])}</h3><ul class="routes">${list.filter((r) => r.hub === hub).map(row).join("")}</ul>`)
    .join("");
}

function subpage(t, pg) {
  const c = pg[t.lang];
  const other = locales.find((l) => l !== t);
  const path = pagePath(t, pg.slug);
  const ctx = { home: false, path, alt: pagePath(other, pg.slug), altLang: other.htmlLang, alternates: locales.map((l) => [l.htmlLang, pagePath(l, pg.slug)]) };
  const L = LBL[t.lang];
  const sections = c.sections
    .map((sec, i) => {
      const soft = i % 2 === 1 ? " sec-soft" : "";
      if (sec.type === "office") return `<section class="sec sec-tight"><div class="wrap office-wrap">${officeCard(t, sec.key, false)}</div></section>`;
      const head = `<div class="sec-head reveal"><h2>${esc(sec.h2)}</h2>${sec.lead ? `<p class="body-l">${esc(sec.lead)}</p>` : ""}</div>`;
      let inner = "";
      if (sec.type === "people") {
        const card = (l) => `<article class="person glow reveal${l.founder ? " person-founder" : ""}"><div class="avatar" aria-hidden="true">${esc(l.initials)}</div><div><p class="person-role">${esc(l.role[li(t)])}</p><h3 class="person-name">${esc(l.name[li(t)])}</h3><p>${esc(l.bio[li(t)])}</p></div></article>`;
        return `<section class="sec"><div class="wrap">
          <div class="sec-head reveal"><h2>${esc(L.cofounders)}</h2><p class="body-l">${esc(L.cofoundersLead)}</p></div>
          <div class="people people-3">${leaders.filter((l) => l.founder).map(card).join("")}</div>
          <div class="sec-head reveal people-gap"><h2>${esc(L.ourTeam)}</h2></div>
          <div class="people">${leaders.filter((l) => !l.founder).map(card).join("")}</div>
        </div></section>`;
      }
      if (sec.type === "text") inner = `<div class="prose reveal">${sec.paras.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
      if (sec.type === "chips") inner = `<ul class="chips chips-lg reveal">${sec.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
      if (sec.type === "points") inner = `<ul class="points points-grid">${sec.items.map(([h, p]) => `<li class="point glow reveal"><span class="point-i">${icon("check")}</span><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></li>`).join("")}</ul>`;
      if (sec.type === "routes") inner = routesHtml(t, sec) + (sec.limit || sec.hub ? `<a class="more-link" href="${pagePath(t, "routes")}">${esc(L.routes)} ${icon("arrow")}</a>` : "");
      if (sec.type === "text") return `<section class="sec${soft}"><div class="wrap text-wrap">${head.replace('<div class="sec-head reveal">', '<div class="reveal">')}${inner}</div></section>`;
      return `<section class="sec${soft}"><div class="wrap">${head}${inner}</div></section>`;
    })
    .join("");
  const crumbs = [[L.home, t.path], [c.crumb, path]];
  const body = `
<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${t.path}">${esc(L.home)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.crumb)}</span></nav>
    <p class="eyebrow eyebrow-light">${esc(c.eyebrow)}</p>
    <h1>${esc(c.h1)}</h1>
    <p class="hero-lead">${esc(c.lead)}</p>
    <div class="hero-ctas">
      <a class="btn btn-cyan" href="${waLink(t)}" target="_blank" rel="noopener">${icon("wa")}${esc(t.hero.primary)}</a>
      <a class="btn btn-ghost" href="${site.primaryPhoneHref}">${icon("phone")}${esc(t.hero.secondary)} · ${esc(site.primaryPhone)}</a>
    </div>
  </div>
</section>
${sections}
${faqHtml(t, c.faq, L.faq)}
<section class="sec sec-tight">
  <div class="wrap">
    <div class="cta-band reveal">
      <div><h2>${esc(L.ctaH)}</h2><p>${esc(L.ctaP)}</p></div>
      <div class="cta-btns">
        <a class="btn btn-cyan" href="${waLink(t)}" target="_blank" rel="noopener">${icon("wa")}${esc(t.hero.primary)}</a>
        <a class="btn btn-ghost" href="${site.primaryPhoneHref}">${icon("phone")}${esc(site.primaryPhone)}</a>
      </div>
    </div>
  </div>
</section>`;
  const ld = [crumbLd(crumbs), faqLd(c.faq)];
  if (pg.slug === "rdf-transport") ld.push({ "@type": "Service", name: c.h1, serviceType: "RDF transport", provider: { "@id": `${site.domain}/#org` }, areaServed: "IN", description: c.description });
  return docHtml(t, ctx, { title: c.title, description: c.description }, body, ld);
}

/* ---------- page ---------- */
function page(t) {
  const other = locales.find((l) => l !== t);
  const waBase = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t.contact.waIntro)}`;

  const ctx = { home: true, path: t.path, alt: other.path, altLang: other.htmlLang, alternates: locales.map((l) => [l.htmlLang, l.path]) };

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
      <a class="more-link" href="${pagePath(t, "leadership")}">${esc(LBL[t.lang].team)} ${icon("arrow")}</a>
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
              ${featured ? `<a class="more-link more-link-light" href="${pagePath(t, "rdf-transport")}">${esc(LBL[t.lang].rdf)} ${icon("arrow")}</a>` : ""}
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
      <a class="lane-card lane-more reveal" href="${pagePath(t, "routes")}"><span>${icon("globe")}</span><h3>${esc(LBL[t.lang].routes)}</h3><span class="more-arrow">${icon("arrow")}</span></a>
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
      ${t.branches.items.map((b) => officeCard(t, b.key, true)).join("")}
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



  const body = [hero, stats, about, services, network, process, branches, faqHtml(t, t.faq.items, t.faq.title, t.faq.eyebrow), contact].join("\n");
  return docHtml(t, ctx, t.meta, body, [faqLd(t.faq.items)]);
}

/* ---------- write ---------- */
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "public"), dist, { recursive: true });
await cp(join(root, "src", "styles.css"), join(dist, "styles.css"));
await cp(join(root, "src", "main.js"), join(dist, "main.js"));
const urls = [locales.map((l) => l.path), ...pages.map((pg) => locales.map((l) => pagePath(l, pg.slug)))];
for (const t of locales) {
  const out = join(dist, t.path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page(t));
  for (const pg of pages) {
    const o = join(dist, pagePath(t, pg.slug), "index.html");
    await mkdir(dirname(o), { recursive: true });
    await writeFile(o, subpage(t, pg));
  }
}
const en = locales.find((l) => l.lang === "en");
await writeFile(
  join(dist, "404.html"),
  docHtml(en, { home: false, path: "/404.html", alt: "/hi/", altLang: "hi-IN", alternates: [["en-IN", "/"], ["hi-IN", "/hi/"]] }, { title: "Page not found | Trans-Jit Express", description: en.meta.description },
    `<section class="page-hero"><div class="hero-bg" aria-hidden="true"></div><div class="wrap"><p class="eyebrow eyebrow-light">404</p><h1>This page doesn't exist.</h1><p class="hero-lead">The page may have moved. Go to the homepage or see our RDF transport services and routes.</p><div class="hero-ctas"><a class="btn btn-cyan" href="/">Homepage</a><a class="btn btn-ghost" href="/rdf-transport/">RDF transport</a><a class="btn btn-ghost" href="/routes/">Routes</a></div></div></section>`, []
  ).replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">')
);
const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls
    .map((set) =>
      set
        .map(
          (u) =>
            `  <url><loc>${site.domain}${u}</loc><lastmod>${today}</lastmod>${set
              .map((a, i) => `<xhtml:link rel="alternate" hreflang="${locales[i].htmlLang}" href="${site.domain}${a}"/>`)
              .join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${site.domain}${set[0]}"/></url>`
        )
        .join("\n")
    )
    .join("\n")}\n</urlset>\n`
);
await writeFile(join(dist, "robots.txt"), LIVE ? `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n");
console.log("Built", urls.flat().length, "pages:", urls.flat().join(" "), "→ dist/", LIVE ? "(LIVE: search engines allowed)" : "(preview: hidden from search engines)");
