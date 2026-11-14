(() => {
  document.documentElement.classList.add("js");
  requestAnimationFrame(() => document.documentElement.classList.add("loaded"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // header shadow
  const hdr = document.querySelector(".hdr");
  const onScroll = () => hdr && hdr.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // mobile menu
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  };
  if (burger && nav) {
    burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  // active nav link
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  // reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // number counters: start at 0 and count up every time the stats box scrolls into view
  const fmt = (n, plain) => (plain ? String(n) : n.toLocaleString("en-IN"));
  const counters = [...document.querySelectorAll(".count")];
  const statsBox = document.querySelector(".stats");
  const frames = new Map();
  const setZero = (el) => {
    cancelAnimationFrame(frames.get(el));
    const plain = el.dataset.plain === "1";
    el.textContent = fmt(plain ? Number(el.dataset.to) - 14 : 0, plain);
  };
  const run = (el, delay) => {
    const to = Number(el.dataset.to);
    const plain = el.dataset.plain === "1";
    const from = plain ? to - 14 : 0;
    const step = to >= 10000 ? 100 : to >= 1000 ? 10 : 1; // 100, 200, 300 … for big numbers
    const dur = 2600;
    const start = performance.now() + delay;
    const tick = (now) => {
      const p = Math.max(0, Math.min(1, (now - start) / dur));
      const e = 1 - Math.pow(1 - p, 4);
      const v = p < 1 ? Math.round((from + (to - from) * e) / step) * step : to;
      el.textContent = fmt(v, plain);
      el.parentElement.classList.toggle("done", p >= 1);
      if (p < 1) frames.set(el, requestAnimationFrame(tick));
    };
    frames.set(el, requestAnimationFrame(tick));
  };
  if (!reduce && "IntersectionObserver" in window && statsBox) {
    counters.forEach(setZero);
    let shown = false;
    new IntersectionObserver(
      ([en]) => {
        if (en.intersectionRatio >= 0.5 && !shown) {
          shown = true;
          counters.forEach((c, i) => run(c, i * 150));
        } else if (!en.isIntersecting && shown) {
          shown = false; // reset so it counts again next time
          counters.forEach(setZero);
        }
      },
      { threshold: [0, 0.5], rootMargin: "0px 0px -25% 0px" }
    ).observe(statsBox);
  }

  // scroll progress bar + header hides on scroll down, shows on scroll up
  const bar = document.querySelector(".progress");
  let lastY = window.scrollY;
  const onMove = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (hdr && !(nav && nav.classList.contains("open"))) {
      hdr.classList.toggle("hide", y > lastY && y > 480);
    }
    lastY = y;
  };
  onMove();
  window.addEventListener("scroll", onMove, { passive: true });

  // soft light that follows the mouse on cards
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".glow").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  // pause SVG motion for reduced-motion users
  if (reduce) document.querySelectorAll(".netmap").forEach((svg) => svg.pauseAnimations && svg.pauseAnimations());

  // quote form → WhatsApp
  const form = document.getElementById("quote");
  if (form) {
    const err = form.querySelector(".form-err");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const get = (k) => String(data.get(k) || "").trim();
      const required = ["name", "phone"];
      let ok = true;
      required.forEach((k) => {
        const input = form.elements[k];
        const bad = !get(k);
        input.setAttribute("aria-invalid", String(bad));
        if (bad) ok = false;
      });
      if (!ok) {
        err.textContent = form.dataset.required;
        err.hidden = false;
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      err.hidden = true;
      const labels = {};
      form.querySelectorAll("label").forEach((l) => {
        const f = l.querySelector("input,select,textarea");
        if (f) labels[f.name] = l.firstChild.textContent.replace("*", "").trim();
      });
      const lines = [form.dataset.intro, ""];
      ["name", "company", "phone", "from", "to", "material", "qty", "message"].forEach((k) => {
        const v = get(k);
        if (v) lines.push(`${labels[k]}: ${v}`);
      });
      const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener");
    });
    form.addEventListener("input", (e) => {
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) e.target.setAttribute("aria-invalid", "false");
    });
  }
})();
