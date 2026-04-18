(function() {
  /* ══════════════════════════════════════════════════════════════
     ps-combined.js v1.0.0 — Pulse Summit page injection.
     Strategy: hide Webflow native chrome (this page ships its own
     dark nav + footer), then inject the full Pulse Summit HTML/CSS
     into a scoped #ps-root. All CSS scoped with --ps- prefix vars.
     Source HTML: tparis7/Pulse-Summit/index.html
     Mockup:      https://tparis7.github.io/Pulse-Summit/
     Dates:       October 3, 2026 (single-day · 12-hour sprint)
     Barometer:   $15K minimum · $80K main goal inside Invest in Impact
     ══════════════════════════════════════════════════════════════ */

  // Guard against double execution
  if (document.getElementById('ps-root')) return;

  // ═══ 0. CANCEL WEBFLOW IX2 BODY ANIMATION ═══
  function cancelBodyAnimations() {
    if (document.body && document.body.getAnimations) {
      document.body.getAnimations().forEach(function(a) { a.cancel(); });
    }
    if (document.body) document.body.style.setProperty('opacity', '1', 'important');
  }
  cancelBodyAnimations();
  document.addEventListener('DOMContentLoaded', cancelBodyAnimations);
  window.addEventListener('load', cancelBodyAnimations);
  setTimeout(cancelBodyAnimations, 100);
  setTimeout(cancelBodyAnimations, 500);
  setTimeout(cancelBodyAnimations, 1500);

  // ═══ 1. ASSET URLS ═══
  // P3 logo hosted on Webflow CDN (same asset the mentorship guide uses) so it loads
  // instantly even before the GitHub repo is synced.
  var LOGO = 'https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7/69b02f65f0068e9fb16f0df1_P3%20Logo.svg';
  // Hero looping video background (re-uses the homepage hero video)
  var HERO_VIDEO = 'https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7%2F69b04a6712d5fdbe9b4e51f8_p3-hero-bg_mp4.mp4';
  // Carousel + background photos live in the tparis7/Pulse-Summit GitHub repo
  var IMG_BASE = 'https://tparis7.github.io/Pulse-Summit/images/';

  // Ensure Inter + Space Grotesk are loaded (they may already be loaded by other pages)
  (function ensureFonts() {
    if (document.querySelector('link[data-ps-fonts]')) return;
    var pc1 = document.createElement('link');
    pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    pc1.setAttribute('data-ps-fonts', '1');
    document.head.appendChild(pc1);
    var pc2 = document.createElement('link');
    pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    pc2.setAttribute('data-ps-fonts', '1');
    document.head.appendChild(pc2);
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap';
    l.setAttribute('data-ps-fonts', '1');
    document.head.appendChild(l);
  })();

  // ═══ 2. INJECT CSS — scoped to #ps-root with --ps- prefix ═══
  var style = document.createElement('style');
  style.setAttribute('data-ps-css', '1');
  style.innerHTML = `
/* ─── Root vars (scoped) ─── */
#ps-root {
  --ps-blue: #1D4ED8;
  --ps-blue-dark: #1E3A8A;
  --ps-blue-deep: #0F1D47;
  --ps-blue-light: #3B82F6;
  --ps-blue-bright: #60A5FA;
  --ps-green: #16A34A;
  --ps-green-dark: #15803D;
  --ps-green-light: #22C55E;
  --ps-green-pale: #DCFCE7;
  --ps-white: #FFFFFF;
  --ps-off-white: #F8FAFC;
  --ps-cool-gray: #F1F5F9;
  --ps-slate: #64748B;
  --ps-slate-dark: #334155;
  --ps-text-dark: #0F172A;
  --ps-text-mid: #475569;
  --ps-text-light: #94A3B8;
  --ps-glass: rgba(255,255,255,0.06);
  --ps-glass-border: rgba(255,255,255,0.1);
}

/* ─── Hide Webflow native chrome while Pulse Summit is active ─── */
body.ps-active { background: #fff; margin: 0; padding: 0; opacity: 1 !important; overflow-x: hidden; }
body.ps-active > *:not(#ps-root):not(script):not(style):not(link):not(noscript):not([data-ps-keep]) { display: none !important; }
html.ps-active { scroll-behavior: smooth; }

/* ─── Universal reset inside #ps-root ─── */
#ps-root *, #ps-root *::before, #ps-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
#ps-root {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--ps-text-dark); background: var(--ps-white);
  line-height: 1.6; -webkit-font-smoothing: antialiased;
}
#ps-root h1, #ps-root h2, #ps-root h3, #ps-root h4 { font-family: 'Space Grotesk', sans-serif; line-height: 1.1; }
#ps-root a { color: inherit; text-decoration: none; text-transform: none; }
#ps-root img { max-width: 100%; display: block; }
#ps-root button { font-family: inherit; text-transform: none; }
#ps-root ul { list-style: none; }

/* ═══════════ NAV ═══════════ */
#ps-root .nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(15,29,71,0.85); backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s;
}
#ps-root .nav.scrolled { background: rgba(15,29,71,0.95); box-shadow: 0 4px 30px rgba(0,0,0,0.2); }
/* Match homepage .p3-nav: full-width flex (NO max-width), padding 16px 40px, height driven by content (CTA 50 + 16+16 = 82). Homepage logo lands at x=40 because the nav is full viewport width with 40px padding-left. */
#ps-root .nav-inner {
  max-width: none !important;
  margin: 0 !important;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 40px !important;
  min-height: 0 !important;
  height: auto !important;
}
/* Matches homepage .p3-nav-logo img (rendered 116×36, from P3%20Logo.svg). */
#ps-root .nav-logo { height: 36px !important; max-height: 36px !important; width: auto; filter: brightness(0) invert(1); object-fit: contain; display: block; }
/* Matches homepage .p3-nav-links: display flex, gap 32px, line-height 30px. */
#ps-root .nav-links { display: flex !important; align-items: center !important; gap: 32px !important; }
/* Matches homepage .p3-nav-links a: Inter 14px/500, color rgba(255,255,255,0.85), line-height 30px, display block, padding 0, letter-spacing normal, text-transform none. */
#ps-root .nav-links a {
  display: block !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important; font-weight: 500 !important;
  line-height: 30px !important;
  color: rgba(255,255,255,0.85) !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  padding: 0 !important;
  transition: color 0.2s;
}
#ps-root .nav-links a:hover { color: #fff !important; }
/* Matches homepage .p3-nav-cta exactly: display flex, padding 10px 24px, border-radius 50px, Inter 14px/600, line-height 30px, color #fff, height 50px (10+30+10). Compound selector beats #ps-root .nav-links a (specificity 0,1,2,0 vs 0,1,1,1). */
#ps-root .nav .nav-cta,
#ps-root .nav-links a.nav-cta {
  display: flex !important; align-items: center !important; justify-content: center !important;
  background: var(--ps-green) !important;
  color: #fff !important;
  padding: 10px 24px !important;
  border-radius: 50px !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important; font-weight: 600 !important;
  line-height: 30px !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(22,163,74,0.3);
}
#ps-root .nav .nav-cta:hover,
#ps-root .nav-links a.nav-cta:hover { background: var(--ps-green-dark) !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(22,163,74,0.4); }
#ps-root .mobile-toggle {
  display: none; background: none; border: none; cursor: pointer;
  width: 32px; height: 32px; position: relative; z-index: 10;
}
#ps-root .mobile-toggle span {
  display: block; width: 22px; height: 2px; background: #fff;
  position: absolute; left: 5px; transition: all 0.3s; border-radius: 2px;
}
#ps-root .mobile-toggle span:nth-child(1) { top: 9px; }
#ps-root .mobile-toggle span:nth-child(2) { top: 15px; }
#ps-root .mobile-toggle span:nth-child(3) { top: 21px; }
#ps-root .mobile-toggle.open span:nth-child(1) { top: 15px; transform: rotate(45deg); }
#ps-root .mobile-toggle.open span:nth-child(2) { opacity: 0; }
#ps-root .mobile-toggle.open span:nth-child(3) { top: 15px; transform: rotate(-45deg); }

/* ═══════════ HERO ═══════════ */
#ps-root .hero {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; padding: 100px 32px 60px;
  background: var(--ps-blue-deep);
}
#ps-root .hero-video { position: absolute; inset: 0; z-index: 0; }
#ps-root .hero-video video {
  width: 100%; height: 100%; object-fit: cover;
  opacity: 0.33; filter: saturate(0.3);
}
#ps-root .hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(170deg, rgba(15,29,71,0.82) 0%, rgba(29,78,216,0.62) 50%, rgba(22,163,74,0.35) 100%);
}
#ps-root .hero-mesh {
  position: absolute; inset: 0; z-index: 2; opacity: 0.06;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.8) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.5) 1px, transparent 1px);
  background-size: 48px 48px;
}
#ps-root .hero-content { position: relative; z-index: 3; text-align: center; max-width: 880px; }
#ps-root .hero-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--ps-glass); border: 1px solid var(--ps-glass-border);
  border-radius: 100px; padding: 8px 22px; margin-bottom: 28px;
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8);
  backdrop-filter: blur(12px); letter-spacing: 0.5px;
}
#ps-root .hero-badge .pulse {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ps-green-light); position: relative;
}
#ps-root .hero-badge .pulse::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: var(--ps-green-light); opacity: 0;
  animation: ps-ping 2s cubic-bezier(0,0,0.2,1) infinite;
}
@keyframes ps-ping { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }

#ps-root .hero h1 {
  font-size: clamp(44px, 7vw, 86px); font-weight: 800;
  color: #fff; letter-spacing: -2.5px; margin-bottom: 4px;
}
#ps-root .hero h1 .line2 {
  display: block; font-size: 0.5em; letter-spacing: 0;
  background: linear-gradient(90deg, var(--ps-blue-bright), var(--ps-green-light));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin-top: 4px;
}
#ps-root .hero-sub {
  font-size: clamp(16px, 2.2vw, 20px); color: rgba(255,255,255,0.65);
  max-width: 580px; margin: 20px auto 12px; font-weight: 400; line-height: 1.7;
}
#ps-root .hero-meta {
  display: flex; align-items: center; justify-content: center;
  gap: 28px; flex-wrap: wrap; margin-bottom: 36px;
  font-size: 14px; color: rgba(255,255,255,0.5); font-weight: 500;
}
#ps-root .hero-meta span { display: flex; align-items: center; gap: 7px; }
#ps-root .hero-meta svg { width: 16px; height: 16px; stroke: var(--ps-green-light); fill: none; stroke-width: 2.5; }
#ps-root .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

#ps-root .btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ps-green); color: #fff;
  padding: 15px 32px; border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
  border: none; cursor: pointer; letter-spacing: 0.3px;
  text-transform: none !important;
  transition: all 0.25s; box-shadow: 0 4px 20px rgba(22,163,74,0.35);
}
#ps-root .btn-primary:hover { background: var(--ps-green-dark); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(22,163,74,0.45); }
#ps-root .btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ps-glass); color: #fff;
  padding: 15px 32px; border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
  border: 1px solid var(--ps-glass-border); cursor: pointer;
  text-transform: none !important;
  transition: all 0.25s;
}
#ps-root .btn-secondary:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }

#ps-root .btn-blue {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ps-blue); color: #fff;
  padding: 15px 32px; border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
  border: none; cursor: pointer;
  text-transform: none !important;
  transition: all 0.25s; box-shadow: 0 4px 20px rgba(29,78,216,0.35);
}
#ps-root .btn-blue:hover { background: var(--ps-blue-dark); transform: translateY(-2px); }

/* ═══════════ STATS ═══════════ */
#ps-root .stats-bar { padding: 0 32px; margin-top: -44px; position: relative; z-index: 10; }
#ps-root .stats-inner {
  max-width: 960px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: #fff; border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
  overflow: hidden;
}
#ps-root .stat-item {
  text-align: center; padding: 28px 20px;
  border-right: 1px solid var(--ps-cool-gray);
}
#ps-root .stat-item:last-child { border-right: none; }
#ps-root .stat-number {
  font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 800;
  background: linear-gradient(135deg, var(--ps-blue), var(--ps-green));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; line-height: 1;
}
#ps-root .stat-label { font-size: 13px; color: var(--ps-text-light); margin-top: 4px; font-weight: 500; letter-spacing: 0.5px; }

/* ═══════════ SECTIONS ═══════════ */
#ps-root section { padding: 48px 32px; }
#ps-root .section-inner { max-width: 1100px; margin: 0 auto; }
#ps-root .section-label {
  font-size: 13px; font-weight: 600; letter-spacing: 0.2px;
  color: var(--ps-green); margin-bottom: 10px;
  display: flex; align-items: center; gap: 8px;
}
#ps-root .section-label::before {
  content: ''; width: 20px; height: 2px;
  background: linear-gradient(90deg, var(--ps-blue), var(--ps-green)); border-radius: 2px;
}
#ps-root .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -1px; margin-bottom: 14px; color: var(--ps-text-dark); }
#ps-root .section-subtitle { font-size: 16px; color: var(--ps-text-mid); max-width: 560px; line-height: 1.7; }

/* ═══════════ ABOUT ═══════════ */
#ps-root .about { background: var(--ps-white); position: relative; overflow: hidden; }
#ps-root .about-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image: url('${IMG_BASE}doctors-park.jpg');
  background-size: cover; background-position: center;
  opacity: 0.11;
}
#ps-root .about .section-inner { position: relative; z-index: 1; }
#ps-root .about-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 36px;
  align-items: center; margin-top: 28px;
}
#ps-root .about-photos {
  display: grid; grid-template-columns: 1fr 1fr;
  grid-template-rows: 170px 170px;
  gap: 12px;
}
#ps-root .about-photo {
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(15,29,71,0.08);
  position: relative;
}
#ps-root .about-photo img {
  width: 100%; height: 100%; object-fit: cover;
  display: block; transition: transform 0.5s;
}
#ps-root .about-photo:hover img { transform: scale(1.04); }
#ps-root .about-photo.tall { grid-row: 1 / span 2; }
#ps-root .about-text p { color: var(--ps-text-mid); font-size: 16px; line-height: 1.8; margin-bottom: 16px; }
#ps-root .about-text p strong { color: var(--ps-text-dark); font-weight: 600; }

/* ═══════════ HOW IT WORKS ═══════════ */
#ps-root .how-it-works { background: var(--ps-off-white); }
#ps-root .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 28px; }
#ps-root .step {
  background: #fff; border-radius: 16px; padding: 32px 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.3s; position: relative; overflow: hidden;
}
#ps-root .step::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--ps-blue), var(--ps-green));
  opacity: 0; transition: opacity 0.3s;
}
#ps-root .step:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); }
#ps-root .step:hover::before { opacity: 1; }
#ps-root .step-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: linear-gradient(135deg, var(--ps-blue) 0%, var(--ps-blue-light) 100%);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px; box-shadow: 0 4px 14px rgba(29,78,216,0.2);
}
#ps-root .step-icon svg { width: 24px; height: 24px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
#ps-root .step h3 { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
#ps-root .step p { color: var(--ps-text-mid); font-size: 14.5px; line-height: 1.7; }
#ps-root .step-tag {
  display: inline-flex; align-items: center; gap: 5px; margin-top: 14px;
  font-size: 12.5px; font-weight: 600; letter-spacing: 0.1px;
  color: var(--ps-green); background: var(--ps-green-pale); padding: 5px 12px; border-radius: 6px;
}

/* ═══════════ TRACKS ═══════════ */
#ps-root .tracks { background: var(--ps-white); }
#ps-root .track-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 28px; }
#ps-root .track-card {
  border: 1px solid var(--ps-cool-gray); border-radius: 14px; padding: 28px 24px;
  transition: all 0.3s; background: #fff; position: relative; overflow: hidden;
}
#ps-root .track-card.tint-blue {
  background: linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%);
  border-color: rgba(29,78,216,0.15);
}
#ps-root .track-card.tint-green {
  background: linear-gradient(180deg, rgba(22,163,74,0.06) 0%, rgba(22,163,74,0.02) 100%);
  border-color: rgba(22,163,74,0.18);
}
#ps-root .track-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(29,78,216,0.08); }
#ps-root .track-card.tint-blue:hover { border-color: rgba(29,78,216,0.35); box-shadow: 0 8px 28px rgba(29,78,216,0.12); }
#ps-root .track-card.tint-green:hover { border-color: rgba(22,163,74,0.35); box-shadow: 0 8px 28px rgba(22,163,74,0.12); }
#ps-root .track-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
#ps-root .track-icon.blue { background: rgba(29,78,216,0.12); }
#ps-root .track-icon.green { background: rgba(22,163,74,0.12); }
#ps-root .track-icon svg { width: 22px; height: 22px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
#ps-root .track-icon.blue svg { stroke: var(--ps-blue); }
#ps-root .track-icon.green svg { stroke: var(--ps-green); }
#ps-root .track-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
#ps-root .track-card p { font-size: 14px; color: var(--ps-text-light); line-height: 1.65; }

/* ═══════════ COMMUNITY CAROUSEL ═══════════ */
#ps-root .community { background: var(--ps-off-white); overflow: hidden; padding: 48px 0; }
#ps-root .community .section-inner { padding: 0 32px; }
#ps-root .carousel-wrap { margin-top: 28px; position: relative; }
#ps-root .carousel-track {
  display: flex; gap: 20px;
  animation: ps-scroll-carousel 40s linear infinite;
  width: max-content;
}
#ps-root .carousel-track:hover { animation-play-state: paused; }
#ps-root .carousel-item {
  flex-shrink: 0; width: 340px; height: 240px;
  border-radius: 14px; overflow: hidden; position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
#ps-root .carousel-item img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s;
}
#ps-root .carousel-item:hover img { transform: scale(1.05); }
#ps-root .carousel-item::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(15,29,71,0.3) 0%, transparent 50%);
  pointer-events: none;
}
@keyframes ps-scroll-carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
#ps-root .carousel-fade-left, #ps-root .carousel-fade-right {
  position: absolute; top: 0; bottom: 0; width: 80px; z-index: 5; pointer-events: none;
}
#ps-root .carousel-fade-left { left: 0; background: linear-gradient(to right, var(--ps-off-white), transparent); }
#ps-root .carousel-fade-right { right: 0; background: linear-gradient(to left, var(--ps-off-white), transparent); }

/* ═══════════ SPONSORS ═══════════ */
#ps-root .sponsors { background: var(--ps-white); }
#ps-root .tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 28px; }
#ps-root .tier-card {
  background: #fff; border-radius: 16px; padding: 36px 28px;
  text-align: center; border: 2px solid var(--ps-cool-gray);
  transition: all 0.3s; position: relative;
}
#ps-root .tier-card:hover { transform: translateY(-4px); }
#ps-root .tier-card.featured {
  border-color: var(--ps-blue);
  box-shadow: 0 8px 40px rgba(29,78,216,0.1);
}
#ps-root .tier-card.featured::before {
  content: 'Most popular';
  position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, var(--ps-blue), var(--ps-green));
  color: #fff; font-size: 11.5px; font-weight: 600; letter-spacing: 0.2px;
  padding: 5px 16px; border-radius: 100px;
}
#ps-root .tier-badge {
  width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 16px;
  display: flex; align-items: center; justify-content: center;
}
#ps-root .tier-badge svg { width: 24px; height: 24px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
#ps-root .tier-badge.bronze { background: rgba(148,163,184,0.1); }
#ps-root .tier-badge.bronze svg { stroke: var(--ps-slate); }
#ps-root .tier-badge.silver { background: rgba(29,78,216,0.08); }
#ps-root .tier-badge.silver svg { stroke: var(--ps-blue); }
#ps-root .tier-badge.gold { background: rgba(22,163,74,0.08); }
#ps-root .tier-badge.gold svg { stroke: var(--ps-green); }
#ps-root .tier-name {
  font-family: 'Space Grotesk', sans-serif; font-size: 14.5px; font-weight: 600;
  letter-spacing: 0.2px; color: var(--ps-text-light);
  margin-bottom: 6px;
}
#ps-root .tier-price {
  font-family: 'Space Grotesk', sans-serif; font-size: 44px; font-weight: 800;
  color: var(--ps-text-dark); line-height: 1;
}
#ps-root .tier-price span { font-size: 18px; color: var(--ps-text-light); font-weight: 500; }
#ps-root .tier-desc { font-size: 14px; color: var(--ps-text-mid); margin: 12px 0 20px; }
#ps-root .tier-perks { list-style: none; text-align: left; margin-bottom: 28px; }
#ps-root .tier-perks li {
  font-size: 14px; color: var(--ps-text-mid); padding: 9px 0;
  border-bottom: 1px solid var(--ps-cool-gray);
  display: flex; align-items: flex-start; gap: 10px; line-height: 1.5;
}
#ps-root .tier-perks li:last-child { border-bottom: none; }
#ps-root .tier-perks .check { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; background: var(--ps-green-pale); display: flex; align-items: center; justify-content: center; margin-top: 1px; }
#ps-root .tier-perks .check svg { width: 11px; height: 11px; stroke: var(--ps-green); fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
#ps-root .btn-tier {
  display: block; width: 100%; padding: 13px; border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px;
  border: 2px solid var(--ps-blue); color: var(--ps-blue);
  background: transparent; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
}
#ps-root .btn-tier:hover { background: var(--ps-blue); color: #fff; }
#ps-root .tier-card.featured .btn-tier {
  background: linear-gradient(135deg, var(--ps-blue), var(--ps-blue-light));
  color: #fff; border-color: transparent;
}
#ps-root .tier-card.featured .btn-tier:hover { background: linear-gradient(135deg, var(--ps-blue-dark), var(--ps-blue)); }

/* ═══════════ FUNDING BAROMETER ═══════════ */
#ps-root .funding-barometer {
  background:
    radial-gradient(ellipse at 15% 40%, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0) 55%),
    radial-gradient(ellipse at 85% 60%, rgba(22,163,74,0.10) 0%, rgba(22,163,74,0) 55%),
    linear-gradient(135deg, rgba(219,234,254,0.55) 0%, rgba(220,252,231,0.55) 100%);
  border: 1px solid rgba(29,78,216,0.10);
  border-radius: 14px;
  padding: 22px 28px;
  margin: 28px 0 32px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(29,78,216,0.04);
  position: relative; overflow: hidden;
}
#ps-root .funding-barometer::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--ps-blue), var(--ps-green));
  opacity: 0.8;
}
#ps-root .barometer-grid {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 32px; align-items: center;
}
#ps-root .barometer-copy { min-width: 0; }
#ps-root .barometer-bar { min-width: 0; }
#ps-root .barometer-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; letter-spacing: 0.2px;
  color: var(--ps-green); margin-bottom: 8px;
}
#ps-root .barometer-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ps-green-light); position: relative; flex-shrink: 0;
}
#ps-root .barometer-dot::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: var(--ps-green-light); opacity: 0;
  animation: ps-ping 2s cubic-bezier(0,0,0.2,1) infinite;
}
#ps-root .funding-barometer h3 {
  font-size: 22px; font-weight: 800; color: var(--ps-text-dark);
  margin-bottom: 8px; letter-spacing: -0.5px; line-height: 1.2;
}
#ps-root .funding-barometer .barometer-copy p {
  font-size: 14.5px; color: var(--ps-text-mid); line-height: 1.6;
  margin-bottom: 0;
}
#ps-root .funding-barometer .barometer-copy p strong { color: var(--ps-text-dark); font-weight: 700; }
#ps-root .barometer-track {
  position: relative;
  height: 14px; border-radius: 100px;
  background: rgba(15,29,71,0.08);
  overflow: visible;
  /* Top room for "Min $15K" pill above, bottom room for "Raised / Goal" labels below. */
  margin: 32px 0 18px 0;
}
#ps-root .barometer-fill {
  position: absolute; top: 0; left: 0; bottom: 0;
  width: 0%;
  background: linear-gradient(90deg, var(--ps-blue) 0%, var(--ps-blue-light) 60%, var(--ps-green) 100%);
  border-radius: 100px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(29,78,216,0.25);
}
/* $15K minimum threshold marker. 15000 / 80000 = 18.75% along the track. */
#ps-root .barometer-minimum {
  position: absolute; top: -6px; bottom: -6px;
  left: 18.75%;
  width: 2px;
  background: var(--ps-green);
  border-radius: 2px;
  z-index: 2;
  box-shadow: 0 0 0 2px rgba(22,163,74,0.15);
}
#ps-root .barometer-minimum::before {
  content: '';
  position: absolute; top: -3px; left: 50%; transform: translateX(-50%);
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--ps-green);
  box-shadow: 0 0 0 3px rgba(22,163,74,0.18);
}
#ps-root .barometer-minimum-label {
  position: absolute;
  /* Sits ABOVE the track so it never collides with the "raised so far" label below. */
  bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.3px;
  color: var(--ps-green);
  white-space: nowrap;
  padding: 2px 7px; border-radius: 100px;
  background: rgba(220,252,231,0.9);
  border: 1px solid rgba(22,163,74,0.25);
}
#ps-root .barometer-labels {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 13.5px; color: var(--ps-text-light);
  margin-bottom: 10px;
}
#ps-root .barometer-labels .raised strong {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--ps-green); font-size: 19px; font-weight: 800;
  margin-right: 4px;
}
#ps-root .barometer-labels .goal strong {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--ps-text-dark); font-weight: 800;
}
#ps-root .barometer-note {
  margin-top: 10px;
  font-size: 12px; color: rgba(30, 41, 59, 0.45); line-height: 1.6;
  display: flex; align-items: flex-start; gap: 8px;
  font-style: italic;
}
#ps-root .barometer-note strong { color: rgba(30, 41, 59, 0.7); font-weight: 700; font-style: normal; }
#ps-root .barometer-note svg {
  flex-shrink: 0; width: 14px; height: 14px;
  stroke: rgba(30, 41, 59, 0.35); fill: none; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round;
  margin-top: 2px;
}

/* ═══════════ REGISTER ═══════════ */
#ps-root .register {
  background: linear-gradient(160deg, var(--ps-blue-deep) 0%, var(--ps-blue-dark) 50%, #0D3320 100%);
  position: relative; overflow: hidden;
}
#ps-root .register::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(22,163,74,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%);
}
#ps-root .register .section-inner { position: relative; z-index: 1; }
#ps-root .register .section-label { color: var(--ps-green-light); }
#ps-root .register .section-label::before { background: linear-gradient(90deg, var(--ps-green-light), var(--ps-blue-bright)); }
#ps-root .register .section-title { color: #fff; }
#ps-root .register .section-subtitle { color: rgba(255,255,255,0.55); }
#ps-root .register-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 28px; }
#ps-root .register-card {
  background: var(--ps-glass); border: 1px solid var(--ps-glass-border);
  border-radius: 16px; padding: 40px 32px; text-align: center;
  backdrop-filter: blur(12px); transition: all 0.3s;
}
#ps-root .register-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-4px); }
#ps-root .register-card .card-icon {
  width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 20px;
  display: flex; align-items: center; justify-content: center;
}
#ps-root .register-card:first-child .card-icon { background: rgba(22,163,74,0.15); }
#ps-root .register-card:last-child .card-icon { background: rgba(59,130,246,0.15); }
#ps-root .register-card .card-icon svg { width: 26px; height: 26px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
#ps-root .register-card:first-child .card-icon svg { stroke: var(--ps-green-light); }
#ps-root .register-card:last-child .card-icon svg { stroke: var(--ps-blue-bright); }
#ps-root .register-card h3 { color: #fff; font-size: 22px; font-weight: 700; margin-bottom: 10px; }
#ps-root .register-card p { color: rgba(255,255,255,0.5); font-size: 14.5px; line-height: 1.7; margin-bottom: 24px; }
#ps-root .register-card .btn-primary { width: 100%; justify-content: center; }
#ps-root .register-card:last-child .btn-primary { background: var(--ps-blue); box-shadow: 0 4px 20px rgba(29,78,216,0.35); }
#ps-root .register-card:last-child .btn-primary:hover { background: var(--ps-blue-dark); }

/* ═══════════ APPLICATION FORMS ═══════════ */
#ps-root .apply-wrap { max-width: 980px; margin: 28px auto 0; position: relative; }
#ps-root .apply-tabs {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 14px; margin-bottom: 18px;
  backdrop-filter: blur(10px);
  width: 100%;
}
#ps-root .apply-tab {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  color: rgba(255,255,255,0.78);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 15.5px; font-weight: 700; letter-spacing: 0.15px;
  padding: 14px 18px; border-radius: 10px;
  transition: all 0.25s; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
#ps-root .apply-tab svg { width: 18px; height: 18px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke: currentColor; }
#ps-root .apply-tab:hover { color: #fff; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.18); }
#ps-root .apply-tab.active {
  background: linear-gradient(135deg, var(--ps-green), var(--ps-blue));
  color: #fff; border-color: transparent;
  box-shadow: 0 6px 22px rgba(22,163,74,0.38), 0 0 0 1px rgba(255,255,255,0.12) inset;
  transform: translateY(-1px);
}
#ps-root .apply-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 18px;
  padding: 26px 30px 24px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}
#ps-root .apply-panel { display: none; }
#ps-root .apply-panel.active { display: block; }
#ps-root .apply-lede { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.55; margin-bottom: 16px; }
#ps-root .apply-lede strong { color: #fff; font-weight: 600; }
#ps-root .apply-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; }
#ps-root .apply-field { display: flex; flex-direction: column; gap: 6px; }
#ps-root .apply-field.full { grid-column: 1 / -1; }
#ps-root .apply-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12.5px; font-weight: 600; letter-spacing: 0.1px;
  color: rgba(255,255,255,0.75);
}
#ps-root .apply-label .req { color: var(--ps-green-light); margin-left: 2px; }
#ps-root .apply-input,
#ps-root .apply-select,
#ps-root .apply-textarea {
  width: 100%; box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-size: 14.5px; color: #fff;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 12px 14px;
  transition: all 0.2s;
}
#ps-root .apply-input:focus,
#ps-root .apply-select:focus,
#ps-root .apply-textarea:focus {
  outline: none;
  border-color: var(--ps-green-light);
  background: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 3px rgba(22,163,74,0.15);
}
#ps-root .apply-input::placeholder,
#ps-root .apply-textarea::placeholder { color: rgba(255,255,255,0.3); }
#ps-root .apply-select {
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.55)' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}
#ps-root .apply-select option { background: var(--ps-blue-deep); color: #fff; }
#ps-root .apply-textarea { resize: vertical; min-height: 68px; font-family: 'Inter', sans-serif; line-height: 1.5; }
#ps-root .apply-submit {
  width: 100%; margin-top: 18px;
  background: linear-gradient(135deg, var(--ps-green), var(--ps-green-dark));
  color: #fff; border: none; cursor: pointer;
  padding: 15px 28px; border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; font-size: 15px; letter-spacing: 0.3px;
  transition: all 0.25s;
  box-shadow: 0 6px 24px rgba(22,163,74,0.3);
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}
#ps-root .apply-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(22,163,74,0.45);
}
#ps-root .apply-submit:disabled { opacity: 0.7; cursor: not-allowed; }
#ps-root .apply-submit.sent { background: linear-gradient(135deg, #05c168, #03a356); box-shadow: 0 6px 24px rgba(5,193,104,0.4); }
#ps-root .apply-submit.err { background: linear-gradient(135deg, #c13535, #8a1919); }
#ps-root .apply-checks {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
}
#ps-root .apply-check {
  display: flex; align-items: center; gap: 10px;
  font-family: Inter, sans-serif; font-size: 13.5px; font-weight: 500;
  color: rgba(255,255,255,0.82);
  cursor: pointer;
  padding: 6px 4px;
  transition: color 0.15s ease;
}
#ps-root .apply-check:hover { color: #fff; }
#ps-root .apply-check input[type="checkbox"] {
  appearance: none; -webkit-appearance: none;
  width: 16px; height: 16px; flex-shrink: 0;
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}
#ps-root .apply-check input[type="checkbox"]:hover {
  border-color: rgba(5,193,104,0.7);
}
#ps-root .apply-check input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #05c168, #03a356);
  border-color: #05c168;
}
#ps-root .apply-check input[type="checkbox"]:checked::after {
  content: ''; position: absolute;
  left: 4px; top: 1px;
  width: 5px; height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
#ps-root .apply-check input[type="checkbox"]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(5,193,104,0.25);
}
#ps-root .apply-fine {
  margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.45);
  text-align: center; line-height: 1.55;
}
#ps-root .apply-fine a { color: rgba(255,255,255,0.7); text-decoration: underline; }
#ps-root .apply-heading {
  color: #fff; font-family: 'Space Grotesk', sans-serif;
  font-size: 22px; font-weight: 700; letter-spacing: -0.3px;
  margin-bottom: 4px;
}
#ps-root .apply-heading-wrap { margin-bottom: 14px; }

/* ═══════════ DONATE ═══════════ */
#ps-root .donate {
  text-align: center; padding: 64px 32px;
  position: relative; overflow: hidden;
  background: var(--ps-blue-deep);
}
#ps-root .donate-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image: url('${IMG_BASE}img-7919.jpg');
  background-size: cover; background-position: center;
  opacity: 0.18; filter: saturate(0.4);
}
#ps-root .donate-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(135deg, rgba(15,29,71,0.88) 0%, rgba(29,78,216,0.7) 50%, rgba(22,163,74,0.5) 100%);
}
#ps-root .donate-inner {
  max-width: 580px; margin: 0 auto; position: relative; z-index: 2;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; padding: 40px 36px; backdrop-filter: blur(8px);
}
#ps-root .donate-heart {
  width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 50%;
  background: rgba(22,163,74,0.2);
  display: flex; align-items: center; justify-content: center;
}
#ps-root .donate-heart svg { width: 24px; height: 24px; fill: var(--ps-green-light); }
#ps-root .donate h2 { font-size: 28px; font-weight: 800; margin-bottom: 10px; color: #fff; }
#ps-root .donate p { color: rgba(255,255,255,0.65); font-size: 15px; max-width: 440px; margin: 0 auto 24px; line-height: 1.7; }

/* ═══════════ FOOTER ═══════════ */
#ps-root .footer { background: var(--ps-blue-deep); color: rgba(255,255,255,0.4); padding: 40px 32px; }
#ps-root .footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
#ps-root .footer-brand { display: flex; align-items: center; gap: 12px; }
#ps-root .footer-brand img { height: 32px; width: auto; filter: brightness(0) invert(1); opacity: 0.7; }
#ps-root .footer-links { display: flex; gap: 24px; }
#ps-root .footer-links a { font-size: 13px; transition: color 0.2s; }
#ps-root .footer-links a:hover { color: rgba(255,255,255,0.8); }
#ps-root .footer-copy {
  font-size: 12px; width: 100%; text-align: center;
  margin-top: 20px; padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

/* ═══════════ RESPONSIVE ═══════════ */
@media (max-width: 1024px) {
  #ps-root .tier-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; }
  #ps-root .about-grid { grid-template-columns: 1fr; gap: 24px; }
  #ps-root .about-photos { grid-template-rows: 160px 160px; }
  #ps-root .track-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  #ps-root section { padding: 36px 16px; }
  /* Matches homepage mobile nav: padding: 16px, height: 64px, logo max-height: 36px. */
  #ps-root .nav-inner { padding: 16px !important; min-height: 64px !important; height: auto !important; }
  #ps-root .nav-logo { height: 36px !important; max-height: 36px !important; }
  #ps-root .nav-links {
    display: none; flex-direction: column; gap: 0;
    position: absolute; top: 100%; left: 0; right: 0;
    background: rgba(15,29,71,0.98); backdrop-filter: blur(20px);
    padding: 12px 24px 22px; border-bottom: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  }
  #ps-root .nav-links.open { display: flex; }
  #ps-root .nav-links a { padding: 15px 2px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15.5px; letter-spacing: 0.2px; }
  #ps-root .nav-links a:last-child { border-bottom: none; }
  /* Register CTA inside hamburger drawer — extra padding + breathing room so it reads as a primary action. */
  #ps-root .nav-cta {
    text-align: center; display: block;
    margin: 18px 0 6px !important;
    padding: 16px 28px !important;
    font-size: 15.5px !important; letter-spacing: 0.3px;
    border-radius: 10px !important;
    box-shadow: 0 6px 22px rgba(22,163,74,0.38);
  }
  #ps-root .mobile-toggle { display: block; }

  /* Hero mobile */
  #ps-root .hero { min-height: auto; padding: 100px 16px 56px; }
  #ps-root .hero h1 { font-size: 38px; letter-spacing: -1px; }
  #ps-root .hero h1 .line2 { font-size: 0.55em; }
  #ps-root .hero-sub { font-size: 15px; margin: 16px auto 8px; }
  #ps-root .hero-meta { gap: 12px; font-size: 13px; margin-bottom: 28px; }
  #ps-root .hero-meta span { gap: 5px; }
  #ps-root .hero-actions { flex-direction: column; align-items: stretch; gap: 10px; }
  #ps-root .hero-actions .btn-primary,
  #ps-root .hero-actions .btn-secondary { justify-content: center; padding: 14px 24px; font-size: 14px; }
  #ps-root .hero-badge { font-size: 12px; padding: 6px 16px; margin-bottom: 20px; }

  /* Stats mobile */
  #ps-root .stats-bar { padding: 0 16px; margin-top: -36px; }
  #ps-root .stats-inner { grid-template-columns: repeat(2, 1fr); }
  #ps-root .stat-item { padding: 20px 12px; }
  #ps-root .stat-item:nth-child(2) { border-right: none; }
  #ps-root .stat-number { font-size: 28px; }
  #ps-root .stat-label { font-size: 11px; }

  /* Section headers mobile */
  #ps-root .section-title { font-size: 26px; margin-bottom: 10px; }
  #ps-root .section-subtitle { font-size: 14px; }
  #ps-root .section-label { font-size: 12px; letter-spacing: 0.1px; margin-bottom: 8px; }

  /* About mobile */
  #ps-root .about-grid { grid-template-columns: 1fr; gap: 24px; }
  #ps-root .about-photos { grid-template-rows: 140px 140px; gap: 10px; }
  #ps-root .about-text p { font-size: 14.5px; margin-bottom: 12px; }

  /* Steps mobile */
  #ps-root .steps { grid-template-columns: 1fr; gap: 14px; }
  #ps-root .step { padding: 24px 20px; }
  #ps-root .step-icon { width: 44px; height: 44px; margin-bottom: 14px; }
  #ps-root .step-icon svg { width: 20px; height: 20px; }
  #ps-root .step h3 { font-size: 18px; }
  #ps-root .step p { font-size: 14px; }

  /* Tracks mobile */
  #ps-root .track-grid { grid-template-columns: 1fr; gap: 12px; }
  #ps-root .track-card { padding: 22px 20px; }
  #ps-root .track-icon { width: 40px; height: 40px; margin-bottom: 12px; }
  #ps-root .track-card h3 { font-size: 16px; }
  #ps-root .track-card p { font-size: 13px; }

  /* Carousel mobile */
  #ps-root .community { padding: 36px 0; }
  #ps-root .community .section-inner { padding: 0 16px; }
  #ps-root .carousel-item { width: 260px; height: 180px; }
  #ps-root .carousel-fade-left, #ps-root .carousel-fade-right { width: 40px; }

  /* Sponsors mobile */
  #ps-root .tier-grid { max-width: 100%; }
  #ps-root .tier-card { padding: 28px 22px; }
  #ps-root .tier-card.featured::before { font-size: 9px; padding: 4px 12px; top: -11px; }
  #ps-root .tier-price { font-size: 36px; }
  #ps-root .tier-perks li { font-size: 13px; padding: 8px 0; }

  /* Barometer mobile */
  #ps-root .funding-barometer { padding: 20px 18px; border-radius: 12px; margin: 24px 0 26px; }
  #ps-root .barometer-grid { grid-template-columns: 1fr; gap: 18px; }
  #ps-root .funding-barometer h3 { font-size: 19px; }
  #ps-root .funding-barometer .barometer-copy p { font-size: 13.5px; }
  #ps-root .barometer-track { height: 12px; }
  #ps-root .barometer-labels { font-size: 12.5px; margin-bottom: 8px; }
  #ps-root .barometer-labels .raised strong { font-size: 17px; }
  #ps-root .barometer-note { font-size: 12px; margin-top: 8px; }

  /* Register mobile */
  #ps-root .register-grid { grid-template-columns: 1fr; gap: 14px; }
  #ps-root .register-card { padding: 28px 22px; }
  #ps-root .register-card h3 { font-size: 20px; }
  #ps-root .register-card p { font-size: 13.5px; margin-bottom: 20px; }
  #ps-root .register-card .btn-primary { padding: 14px 24px; font-size: 14px; }

  /* Apply form mobile */
  #ps-root .apply-wrap { margin-top: 22px; }
  #ps-root .apply-tabs {
    grid-template-columns: 1fr 1fr 1fr; gap: 6px; padding: 6px;
    border-radius: 12px;
  }
  #ps-root .apply-tab {
    padding: 12px 8px; font-size: 12.5px; gap: 6px; min-width: 0; font-weight: 700;
    flex-direction: column; line-height: 1.15;
    text-align: center; letter-spacing: 0.1px;
  }
  #ps-root .apply-tab svg { width: 16px; height: 16px; }
  #ps-root .apply-card { padding: 22px 18px 20px; border-radius: 14px; }
  #ps-root .apply-heading { font-size: 19px; }
  #ps-root .apply-lede { font-size: 13.5px; margin-bottom: 18px; }
  #ps-root .apply-grid { grid-template-columns: 1fr; gap: 12px; }
  #ps-root .apply-submit { padding: 14px 22px; font-size: 14px; }
  #ps-root .apply-checks { grid-template-columns: 1fr; gap: 4px 0; padding: 12px 14px; }
  #ps-root .apply-check { font-size: 13px; }

  /* Donate mobile */
  #ps-root .donate { padding: 48px 16px; }
  #ps-root .donate-inner { padding: 28px 22px; }
  #ps-root .donate h2 { font-size: 24px; }
  #ps-root .donate p { font-size: 14px; }

  /* Footer mobile */
  #ps-root .footer { padding: 32px 16px; }
  #ps-root .footer-inner { flex-direction: column; text-align: center; gap: 12px; }
  #ps-root .footer-brand img { height: 28px; }
  #ps-root .footer-links { flex-wrap: wrap; justify-content: center; gap: 16px; }
  #ps-root .footer-links a { font-size: 13px; }
  #ps-root .footer-copy { font-size: 11px; margin-top: 16px; padding-top: 16px; }
}

/* Small phones (iPhone SE / 420px and narrower) */
@media (max-width: 420px) {
  /* Tab labels wrap better at small widths (icon above label, tight padding) */
  #ps-root .apply-tabs { gap: 4px; padding: 5px; }
  #ps-root .apply-tab {
    padding: 11px 4px; font-size: 11.5px; gap: 4px;
    letter-spacing: 0; line-height: 1.1;
  }
  #ps-root .apply-tab svg { width: 16px; height: 16px; }
  /* Mobile: keep Min $15K pill above the track and scale down type. */
  #ps-root .barometer-track { margin: 30px 0 16px 0; }
  #ps-root .barometer-minimum-label { font-size: 10px; padding: 2px 6px; }
}

/* Extra small phones */
@media (max-width: 375px) {
  #ps-root .hero h1 { font-size: 32px; }
  #ps-root .hero h1 .line2 { font-size: 0.5em; }
  #ps-root .hero-sub { font-size: 14px; }
  #ps-root .stat-number { font-size: 24px; }
  #ps-root .carousel-item { width: 220px; height: 160px; }
  #ps-root .section-title { font-size: 22px; }
  #ps-root .step { padding: 20px 16px; }
  #ps-root .tier-price { font-size: 32px; }
  #ps-root .register-card { padding: 24px 18px; }
  #ps-root .funding-barometer { padding: 18px 14px; }
  #ps-root .funding-barometer h3 { font-size: 17px; }
  /* Tabs: shrink further; keep icon + label stacked */
  #ps-root .apply-tab { padding: 10px 3px; font-size: 11px; }
  #ps-root .apply-tab svg { width: 15px; height: 15px; }
  /* Nav compress on very narrow screens */
  #ps-root .nav-inner { padding: 14px; min-height: 60px; }
  #ps-root .nav-logo { height: 32px; max-height: 32px; }
}
`;
  document.head.appendChild(style);

  // ═══ 3. ACTIVATE BODY + HTML ═══
  document.documentElement.classList.add('ps-active');
  document.body.classList.add('ps-active');

  // ═══ 4. BUILD #ps-root CONTENT ═══
  var root = document.createElement('div');
  root.id = 'ps-root';
  root.innerHTML = `

<!-- ═══ NAV ═══ -->
<nav class="nav" id="ps-nav">
  <div class="nav-inner">
    <a href="https://www.pulseofp3.org" aria-label="Pulse of Perseverance Project">
      <img src="${LOGO}" alt="The Pulse of Perseverance Project" class="nav-logo">
    </a>
    <div class="nav-links" id="ps-navLinks">
      <a href="#ps-about">About</a>
      <a href="#ps-how-it-works">How It Works</a>
      <a href="#ps-tracks">Tracks</a>
      <a href="#ps-sponsors">Sponsor</a>
      <a href="#ps-register" class="nav-cta">Register</a>
    </div>
    <button class="mobile-toggle" id="ps-mobileToggle" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<!-- ═══ HERO ═══ -->
<section class="hero">
  <div class="hero-video">
    <video autoplay muted loop playsinline>
      <source src="${HERO_VIDEO}" type="video/mp4">
    </video>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-mesh"></div>
  <div class="hero-content">
    <div class="hero-badge"><span class="pulse"></span> October 3, 2026 &middot; Chicago, IL</div>
    <h1>Pulse Summit<span class="line2">Technology with Heart</span></h1>
    <p class="hero-sub">A 12-hour hackathon where developers and tech companies build real digital solutions for 5 Chicago nonprofits.</p>
    <div class="hero-meta">
      <span>
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Oct 3, 2026
      </span>
      <span>
        <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Chicago, IL
      </span>
      <span>
        <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        $3K Grand Prize
      </span>
    </div>
    <div class="hero-actions">
      <a href="#ps-register" class="btn-primary">Register Now <span>&rarr;</span></a>
      <a href="#ps-sponsors" class="btn-secondary">Become a Sponsor</a>
    </div>
  </div>
</section>

<!-- ═══ STATS BAR ═══ -->
<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat-item"><div class="stat-number" data-target="12">0</div><div class="stat-label">Hours</div></div>
    <div class="stat-item"><div class="stat-number" data-target="5">0</div><div class="stat-label">Nonprofits Served</div></div>
    <div class="stat-item"><div class="stat-number" data-prefix="$" data-suffix="K" data-target="3">0</div><div class="stat-label">Grand Prize</div></div>
    <div class="stat-item"><div class="stat-number" data-target="1">0</div><div class="stat-label">Mission</div></div>
  </div>
</div>

<!-- ═══ ABOUT ═══ -->
<section class="about" id="ps-about">
  <div class="about-bg"></div>
  <div class="section-inner">
    <div class="section-label">About the Summit</div>
    <div class="section-title">Why Pulse Summit?</div>
    <div class="about-grid">
      <div class="about-text">
        <p><strong>Pulse of Perseverance Project (P3)</strong> is a nonprofit EdTech career accelerator connecting underserved students with mentors through AI-powered smart matching. We've seen firsthand how the right technology can transform a mission.</p>
        <p>But many nonprofits doing incredible community work in Chicago don't have access to the digital tools they need. <strong>Pulse Summit</strong> changes that — bringing together volunteer developers, designers, and tech companies to build real solutions for real organizations over one powerful weekend.</p>
        <p>Five nonprofits will submit project briefs ahead of the event. Teams of developers will choose a challenge and build working solutions in a single 12-hour sprint. Tech sponsors fund the event, mentor teams, and demonstrate corporate social responsibility in action.</p>
      </div>
      <div class="about-photos">
        <div class="about-photo tall">
          <img src="${IMG_BASE}img-7919.jpg" alt="P3 mentor and student moment" loading="lazy">
        </div>
        <div class="about-photo">
          <img src="${IMG_BASE}Copy%20of%20P3_Gala2025_0065%20copy.jpg" alt="P3 Gala 2025 gathering" loading="lazy">
        </div>
        <div class="about-photo">
          <img src="${IMG_BASE}carousel-9.jpg" alt="P3 community celebration" loading="lazy">
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ HOW IT WORKS ═══ -->
<section class="how-it-works" id="ps-how-it-works">
  <div class="section-inner">
    <div class="section-label">How It Works</div>
    <div class="section-title">System Level Change</div>
    <p class="section-subtitle">Whether you're a nonprofit with a need, a developer with skills to share, or a company that wants to make an impact &mdash; there's a role for you.</p>
    <div class="steps">
      <div class="step">
        <div class="step-icon">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <h3>Nonprofits Apply</h3>
        <p>Submit your organization and project brief. Tell us what digital challenge is holding your mission back &mdash; whether it's a website, donor management, data security, or something else entirely.</p>
      </div>
      <div class="step">
        <div class="step-icon" style="background:linear-gradient(135deg, var(--ps-green), var(--ps-green-dark)); box-shadow: 0 4px 14px rgba(22,163,74,0.2);">
          <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14.5" y1="4" x2="9.5" y2="20"/></svg>
        </div>
        <h3>Teams Build</h3>
        <p>Volunteer developers, designers, and data scientists form teams, select a nonprofit challenge, and build a working solution over the weekend. Mentors from sponsors are available to guide teams.</p>
      </div>
      <div class="step">
        <div class="step-icon" style="background:linear-gradient(135deg, #7C3AED, #A855F7); box-shadow: 0 4px 14px rgba(124,58,237,0.2);">
          <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3>Solutions Launch</h3>
        <p>Teams demo their builds to a panel of judges. The winning team takes home the $3,000 grand prize &mdash; and every nonprofit walks away with a real, deployable solution.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══ PROJECT TRACKS ═══ -->
<section class="tracks" id="ps-tracks">
  <div class="section-inner">
    <div class="section-label">Project Tracks</div>
    <div class="section-title">What Teams Will Build</div>
    <p class="section-subtitle">Nonprofit partners will submit projects from any of these tracks. Specific briefs shared before the event.</p>
    <div class="track-grid">
      <div class="track-card tint-blue">
        <div class="track-icon blue">
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <h3>Website Upgrades</h3>
        <p>Redesigns, accessibility improvements, mobile optimization, and CMS migrations for outdated websites.</p>
      </div>
      <div class="track-card tint-green">
        <div class="track-icon green">
          <svg viewBox="0 0 24 24"><path d="M12 3l1.9 4.9L18.8 9.8l-4.9 1.9L12 16.6l-1.9-4.9L5.2 9.8l4.9-1.9L12 3z"/><path d="M19 15l1 2.3 2.3 1-2.3 1L19 21.6l-1-2.3-2.3-1 2.3-1L19 15z"/></svg>
        </div>
        <h3>AI Solutions</h3>
        <p>Chatbots, smart matching tools, automated intake forms, and AI-powered workflows to multiply capacity.</p>
      </div>
      <div class="track-card tint-blue">
        <div class="track-icon blue">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </div>
        <h3>Donor Management</h3>
        <p>CRM setup, donation tracking dashboards, automated receipts, and reporting tools to streamline fundraising.</p>
      </div>
      <div class="track-card tint-green">
        <div class="track-icon green">
          <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1"/></svg>
        </div>
        <h3>Data Security</h3>
        <p>Security audits, encryption, FERPA/HIPAA compliance tooling, and incident response planning.</p>
      </div>
      <div class="track-card tint-blue">
        <div class="track-icon blue">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
        </div>
        <h3>Social Media &amp; Marketing</h3>
        <p>Content calendars, brand kits, social media strategy, analytics dashboards, and storytelling frameworks.</p>
      </div>
      <div class="track-card tint-green">
        <div class="track-icon green">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <h3>Marketing Automation</h3>
        <p>Email campaigns, lead nurturing flows, event registration systems, and automated outreach sequences.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══ REGISTER ═══ -->
<section class="register" id="ps-register">
  <div class="section-inner">
    <div class="section-label">Get Involved</div>
    <div class="section-title">Apply to Pulse Summit</div>
    <p class="section-subtitle">Whether you're a nonprofit with a need or a sponsor, developer, or mentor ready to contribute &mdash; start here.</p>

    <div class="apply-wrap">
      <div class="apply-tabs" role="tablist">
        <button class="apply-tab active" data-panel="panel-nonprofit" data-apptype="Nonprofit Candidate" type="button" role="tab">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Nonprofit Candidate
        </button>
        <button class="apply-tab" data-panel="panel-sponsor" data-apptype="Event Sponsor" type="button" role="tab">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Event Sponsor
        </button>
        <button class="apply-tab" data-panel="panel-developer" data-apptype="Volunteer Developer" type="button" role="tab">
          <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14.5" y1="4" x2="9.5" y2="20"/></svg>
          Volunteer Developer
        </button>
      </div>

      <div class="apply-card">
        <!-- ═══ NONPROFIT PANEL ═══ -->
        <div class="apply-panel active" id="panel-nonprofit" role="tabpanel">
          <div class="apply-heading-wrap">
            <div class="apply-heading">Nonprofit Project Application</div>
          </div>
          <p class="apply-lede">Tell us about your mission and the digital challenge holding it back. <strong>Five nonprofits</strong> will be selected.</p>
          <form id="ps-form-nonprofit" class="ps-apply-form" data-type="nonprofit" novalidate>
            <div class="apply-grid">
              <div class="apply-field">
                <label class="apply-label">Organization Name <span class="req">*</span></label>
                <input type="text" name="orgName" class="apply-input" placeholder="Your nonprofit" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Website</label>
                <input type="url" name="orgWebsite" class="apply-input" placeholder="https://&hellip;">
              </div>
              <div class="apply-field">
                <label class="apply-label">Your Name <span class="req">*</span></label>
                <input type="text" name="contactName" class="apply-input" placeholder="Jane Smith" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Your Role <span class="req">*</span></label>
                <input type="text" name="contactRole" class="apply-input" placeholder="Executive Director" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Work Email <span class="req">*</span></label>
                <input type="email" name="contactEmail" class="apply-input" placeholder="jane@org.org" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Phone</label>
                <input type="tel" name="contactPhone" class="apply-input" placeholder="(312) 555-0123">
              </div>
              <div class="apply-field">
                <label class="apply-label">Mission Area <span class="req">*</span></label>
                <select name="missionArea" class="apply-select" required>
                  <option value="">Select&hellip;</option>
                  <option>Education</option>
                  <option>Health &amp; Medicine</option>
                  <option>Community &amp; Social Services</option>
                  <option>Youth Development</option>
                  <option>Workforce Development</option>
                  <option>STEM, Arts, Culture</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="apply-field">
                <label class="apply-label">Project Track <span class="req">*</span></label>
                <select name="projectTrack" class="apply-select" required>
                  <option value="">Select&hellip;</option>
                  <option>Website Upgrades</option>
                  <option>AI Solutions</option>
                  <option>Donor Management</option>
                  <option>Data Security</option>
                  <option>Social Media &amp; Marketing</option>
                  <option>Marketing Automation</option>
                  <option>Other / Not sure yet</option>
                </select>
              </div>
              <div class="apply-field full">
                <label class="apply-label">Project Brief <span class="req">*</span></label>
                <textarea name="projectBrief" class="apply-textarea" rows="3" placeholder="What problem do you want solved? What would success look like?" required></textarea>
              </div>
            </div>
            <button type="submit" class="apply-submit">Submit Application <span>&rarr;</span></button>
            <div class="apply-fine">We'll review applications on a rolling basis and confirm the 5 selected nonprofits by June 2026.</div>
          </form>
        </div>

        <!-- ═══ SPONSOR PANEL ═══ -->
        <div class="apply-panel" id="panel-sponsor" role="tabpanel">
          <div class="apply-heading-wrap">
            <div class="apply-heading">Event Sponsor Application</div>
          </div>
          <p class="apply-lede">Back the Summit, support five nonprofits, and put your brand in front of Chicago's tech-for-good community.</p>
          <form id="ps-form-sponsor" class="ps-apply-form" data-type="sponsor" novalidate>
            <div class="apply-grid">
              <div class="apply-field">
                <label class="apply-label">Your Name <span class="req">*</span></label>
                <input type="text" name="contactName" class="apply-input" placeholder="Jane Smith" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Email <span class="req">*</span></label>
                <input type="email" name="contactEmail" class="apply-input" placeholder="jane@company.com" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Company / Organization <span class="req">*</span></label>
                <input type="text" name="company" class="apply-input" placeholder="Your company" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Title / Role</label>
                <input type="text" name="title" class="apply-input" placeholder="VP of Community Impact">
              </div>
              <div class="apply-field full">
                <label class="apply-label">Sponsorship tier <span class="req">*</span></label>
                <select name="tier" class="apply-select" required>
                  <option value="">Select&hellip;</option>
                  <option>Community &mdash; $2,000</option>
                  <option>Impact &mdash; $10,000</option>
                  <option>Visionary &mdash; $25,000</option>
                  <option>Custom / Let's talk</option>
                </select>
              </div>
              <div class="apply-field full">
                <label class="apply-label">Anything else we should know?</label>
                <textarea name="notes" class="apply-textarea" rows="3" placeholder="Goals, timing, specific asks&hellip;"></textarea>
              </div>
            </div>
            <button type="submit" class="apply-submit">Submit Application <span>&rarr;</span></button>
            <div class="apply-fine">We'll reach out within a few days to finalize sponsorship details.</div>
          </form>
        </div>

        <!-- ═══ DEVELOPER PANEL ═══ -->
        <div class="apply-panel" id="panel-developer" role="tabpanel">
          <div class="apply-heading-wrap">
            <div class="apply-heading">Volunteer Developer Application</div>
          </div>
          <p class="apply-lede">Bring your skills to the weekend &mdash; build real tools for real nonprofits alongside a team.</p>
          <form id="ps-form-developer" class="ps-apply-form" data-type="developer" novalidate>
            <div class="apply-grid">
              <div class="apply-field">
                <label class="apply-label">Your Name <span class="req">*</span></label>
                <input type="text" name="contactName" class="apply-input" placeholder="Jane Smith" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Email <span class="req">*</span></label>
                <input type="email" name="contactEmail" class="apply-input" placeholder="jane@company.com" required>
              </div>
              <div class="apply-field">
                <label class="apply-label">Company / Organization</label>
                <input type="text" name="company" class="apply-input" placeholder="(optional)">
              </div>
              <div class="apply-field">
                <label class="apply-label">Title / Role</label>
                <input type="text" name="title" class="apply-input" placeholder="Software Engineer">
              </div>
              <div class="apply-field full">
                <label class="apply-label">Primary Skills <span class="req">*</span></label>
                <div class="apply-checks" role="group" aria-label="Primary Skills">
                  <label class="apply-check"><input type="checkbox" name="skills" value="Frontend / Web"><span>Frontend / Web</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Backend / API"><span>Backend / API</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Full-stack"><span>Full-stack</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Mobile (iOS / Android)"><span>Mobile (iOS / Android)</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="AI / ML"><span>AI / ML</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Design (UX/UI, brand)"><span>Design (UX/UI, brand)</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Data / Analytics"><span>Data / Analytics</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Product / PM"><span>Product / PM</span></label>
                  <label class="apply-check"><input type="checkbox" name="skills" value="Other"><span>Other</span></label>
                </div>
              </div>
              <div class="apply-field full">
                <label class="apply-label">Anything else we should know?</label>
                <textarea name="notes" class="apply-textarea" rows="3" placeholder="Availability, team preferences, nonprofits you'd love to help&hellip;"></textarea>
              </div>
            </div>
            <button type="submit" class="apply-submit">Submit Application <span>&rarr;</span></button>
            <div class="apply-fine">We'll confirm your role and share next steps within a few days.</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ SPONSORSHIP TIERS ═══ -->
<section class="sponsors" id="ps-sponsors">
  <div class="section-inner">
    <div class="section-label">Sponsorship</div>
    <div class="section-title">Invest in Impact</div>
    <p class="section-subtitle">Your sponsorship funds the event, supports 5 nonprofits, and puts your brand in front of Chicago's tech-for-good community.</p>

    <!-- ═══ FUNDING BAROMETER ═══ -->
    <div class="funding-barometer" id="ps-barometer">
      <div class="barometer-grid">
        <div class="barometer-copy">
          <div class="barometer-eyebrow">
            <span class="barometer-dot"></span>
            Event Funding Target
          </div>
          <h3>Help Us Light the Fuse</h3>
          <p><strong>$15,000 by July 31</strong> is the minimum to hold the event &mdash; covering venue, meals, awards, and materials for all five nonprofit builds.</p>
        </div>
        <div class="barometer-bar">
          <div class="barometer-track">
            <div class="barometer-minimum" aria-label="$15,000 minimum threshold">
              <span class="barometer-minimum-label">Min $15K</span>
            </div>
            <div class="barometer-fill" id="ps-barometerFill" style="width: 0%"></div>
          </div>
          <div class="barometer-labels">
            <div class="raised"><strong>$0</strong> raised so far</div>
            <div class="goal">Goal: <strong>$80,000</strong></div>
          </div>
        </div>
      </div>
    </div>

    <div class="tier-grid">
      <div class="tier-card">
        <div class="tier-badge bronze">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div class="tier-name">Community</div>
        <div class="tier-price"><span>$</span>2K</div>
        <div class="tier-desc">Show your support</div>
        <ul class="tier-perks">
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Logo on event website &amp; signage</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Social media recognition</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> 2 employee volunteer spots</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Certificate of partnership</li>
        </ul>
        <a href="#ps-register" class="btn-tier">Become a Sponsor</a>
      </div>
      <div class="tier-card featured">
        <div class="tier-badge silver">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="tier-name">Impact</div>
        <div class="tier-price"><span>$</span>10K</div>
        <div class="tier-desc">Lead the charge</div>
        <ul class="tier-perks">
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Everything in Community</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Branded mentor lounge</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> 5 employee volunteer spots</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Speaking slot at opening ceremony</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Featured in post-event impact report</li>
        </ul>
        <a href="#ps-register" class="btn-tier">Become a Sponsor</a>
      </div>
      <div class="tier-card">
        <div class="tier-badge gold">
          <svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M6 4h12v6a6 6 0 01-12 0V4z"/><path d="M10 17h4"/><path d="M12 15v2"/><path d="M8 21h8"/><path d="M9 21v-2a3 3 0 016 0v2"/></svg>
        </div>
        <div class="tier-name">Visionary</div>
        <div class="tier-price"><span>$</span>25K</div>
        <div class="tier-desc">Transform communities</div>
        <ul class="tier-perks">
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Everything in Impact</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Presenting sponsor status</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> 10 employee volunteer spots</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Keynote speaking opportunity</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Year-round P3 partnership recognition</li>
          <li><span class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Exclusive post-event networking dinner</li>
        </ul>
        <a href="#ps-register" class="btn-tier">Become a Sponsor</a>
      </div>
    </div>
  </div>
</section>

<!-- ═══ COMMUNITY CAROUSEL ═══ -->
<section class="community" id="ps-community">
  <div class="section-inner">
    <div class="section-label">Community Impact</div>
    <div class="section-title">Built on Real Relationships</div>
    <p class="section-subtitle">From transformative mentorships and partnerships to improve national student outcomes &mdash; P3 brings people together to change lives.</p>
  </div>
  <div class="carousel-wrap">
    <div class="carousel-fade-left"></div>
    <div class="carousel-fade-right"></div>
    <div class="carousel-track">
      <div class="carousel-item"><img src="${IMG_BASE}carousel-1.jpg" alt="P3 scholarship award ceremony" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-2.jpg" alt="P3 Gala 2025 gathering" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-3.jpg" alt="P3 community event" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-4.jpg" alt="P3 mentorship in action" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-5.jpg" alt="P3 community gathering" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-6.jpg" alt="P3 impact event" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-7.jpg" alt="P3 community impact" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-8.jpg" alt="P3 event gathering" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-9.jpg" alt="P3 Gala celebration" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-10.jpg" alt="P3 community event" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-11.jpg" alt="P3 impact story" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-12.jpg" alt="P3 community" loading="lazy"></div>
      <!-- Duplicate set for seamless infinite scroll -->
      <div class="carousel-item"><img src="${IMG_BASE}carousel-1.jpg" alt="P3 scholarship award ceremony" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-2.jpg" alt="P3 Gala 2025 gathering" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-3.jpg" alt="P3 community event" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-4.jpg" alt="P3 mentorship in action" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-5.jpg" alt="P3 community gathering" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-6.jpg" alt="P3 impact event" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-7.jpg" alt="P3 community impact" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-8.jpg" alt="P3 event gathering" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-9.jpg" alt="P3 Gala celebration" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-10.jpg" alt="P3 community event" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-11.jpg" alt="P3 impact story" loading="lazy"></div>
      <div class="carousel-item"><img src="${IMG_BASE}carousel-12.jpg" alt="P3 community" loading="lazy"></div>
    </div>
  </div>
</section>

<!-- ═══ DONATE ═══ -->
<section class="donate">
  <div class="donate-bg"></div>
  <div class="donate-overlay"></div>
  <div class="donate-inner">
    <div class="donate-heart">
      <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
    </div>
    <h2>Support the Mission</h2>
    <p>Every dollar helps fund the event, provide meals for participants, and ensure every nonprofit walks away with a real solution.</p>
    <a href="https://kindest.com/the-pulse-of-perseverance" target="_blank" class="btn-primary" style="display:inline-flex;">Donate via Kindest <span>&rarr;</span></a>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="${LOGO}" alt="P3">
    </div>
    <div class="footer-links">
      <a href="https://www.pulseofp3.org" target="_blank">Website</a>
      <a href="https://www.pulseofp3.org/about" target="_blank">About P3</a>
      <a href="https://kindest.com/the-pulse-of-perseverance" target="_blank">Donate</a>
      <a href="mailto:thomas@pulseofp3.org">Contact</a>
    </div>
    <div class="footer-copy">&copy; 2026 Pulse of Perseverance Project. All rights reserved. &middot; Pulse Summit is a community initiative of P3.</div>
  </div>
</footer>
`;

  document.body.appendChild(root);

  // ═══ 5. INITIALIZE BEHAVIORS ═══
  function initPulseSummit() {
    // Nav scroll
    var nav = document.getElementById('ps-nav');
    function onScroll() {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu toggle
    var toggle = document.getElementById('ps-mobileToggle');
    var links = document.getElementById('ps-navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', function() {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
      });
      links.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          toggle.classList.remove('open');
          links.classList.remove('open');
        });
      });
    }

    // Smooth scroll for internal anchors
    root.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var t = document.querySelector(href);
        if (t) {
          e.preventDefault();
          window.scrollTo({
            top: t.getBoundingClientRect().top + window.pageYOffset - 72,
            behavior: 'smooth'
          });
        }
      });
    });

    // Stat counter animation
    var statsInner = root.querySelector('.stats-inner');
    if (statsInner && 'IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.stat-number').forEach(function(el) {
            var target = parseInt(el.dataset.target, 10);
            var prefix = el.dataset.prefix || '';
            var suffix = el.dataset.suffix || '';
            var current = 0;
            var step = Math.max(1, Math.ceil(target / 25));
            var timer = setInterval(function() {
              current += step;
              if (current >= target) { current = target; clearInterval(timer); }
              el.textContent = prefix + current + suffix;
            }, 40);
          });
          statsObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      statsObserver.observe(statsInner);
    }

    // Barometer fill animation (reveal on scroll — 0% target here, but animates
    // smoothly when raised amount is updated in the future via data-raised attr)
    var barometer = document.getElementById('ps-barometer');
    var fill = document.getElementById('ps-barometerFill');
    if (barometer && fill && 'IntersectionObserver' in window) {
      var bObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (!e.isIntersecting) return;
          // Currently $0 of $80K main goal — read from data-raised if set.
          // Minimum threshold at $15K is rendered as a visual marker on the track.
          var raised = parseFloat(barometer.getAttribute('data-raised') || '0');
          var goal = parseFloat(barometer.getAttribute('data-goal') || '80000');
          var pct = Math.max(0, Math.min(100, (raised / goal) * 100));
          // Give a tiny sliver so fill animation is visible even at 0
          fill.style.width = (pct > 0 ? pct : 0) + '%';
          bObs.unobserve(e.target);
        });
      }, { threshold: 0.3 });
      bObs.observe(barometer);
    }

    // Scroll-triggered fade-in for cards
    if ('IntersectionObserver' in window) {
      var fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      root.querySelectorAll('.step, .track-card, .tier-card, .register-card, .funding-barometer, .apply-wrap').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
      });
    }

    // ═══ APPLY FORM TABS + GOOGLE FORM SUBMIT ═══
    // Google Form: https://forms.gle/5XLyaRss74P8rYZb8 (Nonprofit / Sponsor / Developer)
    // GFORM_ID is the form's /e/ ID (from its public /formResponse URL).
    // ENTRY_MAP: each field name → matching entry.NNNNN from the form's pre-filled link.
    // APPLICATION_TYPE_ENTRY: the entry ID for the Application Type question (shared across all 3 tabs).
    var GFORM_ID = '1FAIpQLSf1QYBaOc5Gg1yvciCLemXK0yMflRhQafPwp6BbcKVtdhy9yg';
    var APPLICATION_TYPE_ENTRY = 'entry.1097444396';
    // Shared fields across tabs use the same entry IDs (single Google Form, branched by Application Type).
    var ENTRY_MAP = {
      nonprofit: {
        orgName:       'entry.872383194',
        orgWebsite:    'entry.1535411882',
        contactName:   'entry.1104467785',
        contactRole:   'entry.2016913964',
        contactEmail:  'entry.502489052',
        contactPhone:  'entry.110425999',
        missionArea:   'entry.381169465',
        projectTrack:  'entry.2138514737',
        projectBrief:  'entry.265627140'
      },
      sponsor: {
        contactName:   'entry.1104467785',
        contactEmail:  'entry.502489052',
        company:       'entry.872383194',
        title:         'entry.2016913964',
        tier:          'entry.1382850759',
        notes:         'entry.1648607451'
      },
      developer: {
        contactName:   'entry.1104467785',
        contactEmail:  'entry.502489052',
        company:       'entry.872383194',
        title:         'entry.2016913964',
        skills:        'entry.182438824', // multi-select: appended once per checked value
        notes:         'entry.1648607451'
      }
    };

    // Tab switching — also tracks active Application Type for submission
    var tabs = root.querySelectorAll('.apply-tab');
    var panels = root.querySelectorAll('.apply-panel');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var target = tab.getAttribute('data-panel');
        tabs.forEach(function(t) { t.classList.toggle('active', t === tab); });
        panels.forEach(function(p) { p.classList.toggle('active', p.id === target); });
      });
    });

    function getActiveAppType() {
      var activeTab = root.querySelector('.apply-tab.active');
      return activeTab ? (activeTab.getAttribute('data-apptype') || '') : '';
    }

    // Form submit handler
    function submitApplyForm(e) {
      e.preventDefault();
      var form = e.target;
      var type = form.getAttribute('data-type');
      var btn = form.querySelector('.apply-submit');
      var originalBtn = btn.innerHTML;

      // Basic required-field check (text/select/textarea)
      var missing = false;
      form.querySelectorAll('[required]').forEach(function(el) {
        if (!el.value || !el.value.trim()) {
          el.style.borderColor = '#c13535';
          missing = true;
        } else {
          el.style.borderColor = '';
        }
      });
      // Developer tab: at least one Primary Skill must be checked
      if (type === 'developer') {
        var skillBoxes = form.querySelectorAll('input[type="checkbox"][name="skills"]');
        var anyChecked = false;
        skillBoxes.forEach(function(cb) { if (cb.checked) anyChecked = true; });
        var checksWrap = form.querySelector('.apply-checks');
        if (!anyChecked) {
          missing = true;
          if (checksWrap) checksWrap.style.borderColor = '#c13535';
        } else if (checksWrap) {
          checksWrap.style.borderColor = '';
        }
      }
      if (missing) {
        btn.classList.add('err');
        btn.innerHTML = 'Please fill required fields';
        setTimeout(function() {
          btn.classList.remove('err');
          btn.innerHTML = originalBtn;
        }, 2500);
        return;
      }

      btn.disabled = true;
      btn.innerHTML = 'Sending&hellip;';

      var fd = new FormData();
      var map = ENTRY_MAP[type] || {};

      // Application Type (from active tab's data-apptype)
      if (APPLICATION_TYPE_ENTRY && APPLICATION_TYPE_ENTRY.indexOf('PLACEHOLDER') === -1) {
        fd.append(APPLICATION_TYPE_ENTRY, getActiveAppType());
      }

      Object.keys(map).forEach(function(name) {
        var entryId = map[name];
        if (!entryId || entryId.indexOf('PLACEHOLDER') !== -1) return;

        // Checkbox multi-value fields (e.g. skills)
        var checks = form.querySelectorAll('input[type="checkbox"][name="' + name + '"]');
        if (checks.length) {
          checks.forEach(function(cb) {
            if (cb.checked) fd.append(entryId, cb.value || '');
          });
          return;
        }

        // Single input/select/textarea
        var el = form.querySelector('[name="' + name + '"]');
        if (el) fd.append(entryId, el.value || '');
      });

      if (!GFORM_ID || GFORM_ID.indexOf('REPLACE') !== -1 || hasPlaceholderEntries(map)) {
        // Not yet fully wired — simulate success and log payload for inspection
        var payload = {};
        fd.forEach(function(v, k) {
          if (payload[k] === undefined) payload[k] = v;
          else if (Array.isArray(payload[k])) payload[k].push(v);
          else payload[k] = [payload[k], v];
        });
        console.warn('[ps-apply] Google Form entry IDs pending. Tab:', type, 'AppType:', getActiveAppType(), 'Payload:', payload);
        btn.classList.add('sent');
        btn.innerHTML = 'Received ✓ (wire-up pending)';
        setTimeout(function() {
          btn.disabled = false;
          btn.classList.remove('sent');
          btn.innerHTML = originalBtn;
        }, 3500);
        return;
      }

      var url = 'https://docs.google.com/forms/u/0/d/e/' + GFORM_ID + '/formResponse';
      fetch(url, { method: 'POST', mode: 'no-cors', body: fd }).then(function() {
        btn.classList.add('sent');
        btn.innerHTML = 'Application sent ✓';
        form.reset();
        setTimeout(function() {
          btn.disabled = false;
          btn.classList.remove('sent');
          btn.innerHTML = originalBtn;
        }, 3500);
      }).catch(function() {
        btn.classList.add('err');
        btn.innerHTML = 'Error — try again';
        btn.disabled = false;
        setTimeout(function() {
          btn.classList.remove('err');
          btn.innerHTML = originalBtn;
        }, 3500);
      });
    }

    function hasPlaceholderEntries(map) {
      var keys = Object.keys(map);
      for (var i = 0; i < keys.length; i++) {
        if (String(map[keys[i]]).indexOf('PLACEHOLDER') !== -1) return true;
      }
      return false;
    }

    root.querySelectorAll('.ps-apply-form').forEach(function(f) {
      f.addEventListener('submit', submitApplyForm);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPulseSummit);
  } else {
    initPulseSummit();
  }
})();
