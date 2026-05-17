import { useEffect } from "react";
import { Link } from "react-router-dom";

const style = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy: #f5efe4;
  --navy-2: #ede3d2;
  --navy-3: #e5dcc9;
  --purple: #1f2937;
  --purple-glow: #c2410c;
  --pink: #b45309;
  --pink-glow: #d97706;
  --cyan: #0f766e;
  --text-primary: #14212b;
  --text-secondary: #46515d;
  --text-muted: #6f6a63;
  --border: rgba(20,33,43,0.12);
  --font-display: 'Sora', sans-serif;
  --font-body: 'Manrope', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  background:
    radial-gradient(circle at top, rgba(193,65,12,0.08), transparent 34%),
    linear-gradient(180deg, #f7f2e8 0%, #f1eadf 48%, #ece3d4 100%);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* NOISE OVERLAY */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 999;
}

/* GRID TEXTURE */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(20,33,43,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20,33,43,0.07) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 76% 76% at 50% 45%, black 25%, transparent 78%);
  pointer-events: none;
}

/* NAV */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 3rem;
  background: rgba(247,242,232,0.8);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(20,33,43,0.08);
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-logo span {
  display: inline-block;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--pink-glow), var(--pink));
  box-shadow: 0 0 0 5px rgba(217,119,6,0.14);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  transition: color 0.2s;
  letter-spacing: 0.01em;
}

.nav-links a:hover { color: var(--text-primary); }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
}

.btn-primary {
  background: #16202b;
  color: #f6efe4;
  border: none;
  box-shadow: 0 10px 24px rgba(20,33,43,0.18);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(20,33,43,0.22);
  background: #0f1720;
}

.btn-ghost {
  background: rgba(255,255,255,0.5);
  color: var(--text-secondary);
  border: 1px solid rgba(20,33,43,0.12);
}

.btn-ghost:hover {
  color: var(--text-primary);
  border-color: rgba(20,33,43,0.18);
  background: rgba(255,255,255,0.72);
}

.btn-large {
  padding: 1rem 2.25rem;
  font-size: 1rem;
  border-radius: 10px;
}

/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  padding: 7.5rem 2rem 4rem;
  overflow: hidden;
}

.hero-layout {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  gap: 2rem;
  align-items: start;
}

.hero-copy {
  padding-top: 2rem;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 8px;
  padding: 0.45rem 0.8rem;
  border: 1px solid rgba(20,33,43,0.12);
  background: rgba(255,255,255,0.55);
  position: relative;
  z-index: 1;
  border-radius: 999px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}
  position: relative;
  z-index: 1;

.hero-kicker::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pink-glow);
}

.hero-side {
  display: grid;
  gap: 1rem;
}

.hero-panel {
  border: 1px solid rgba(20,33,43,0.12);
  background: rgba(255,255,255,0.58);
  border-radius: 12px;
  overflow: hidden;
}

.hero-panel-map {
  padding: 0.85rem;
}

.hero-panel-summary {
  padding: 1rem 1.1rem;
}

.panel-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.9rem;
}

.room-details {
  display: grid;
  gap: 0.8rem;
}

.room-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(20,33,43,0.08);
}

.room-row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.room-row span {
  font-size: 0.84rem;
  color: var(--text-muted);
}

.room-row strong {
  font-size: 0.94rem;
  color: var(--text-primary);
  font-weight: 600;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.metric {
  padding-top: 0.9rem;
  border-top: 1px solid rgba(20,33,43,0.12);
}

.metric strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.3rem;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metric span {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.hero-glow-1 {
  position: absolute;
  width: 700px; height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 68%);
  top: -220px; left: -180px;
  pointer-events: none;
}

.hero-glow-2 {
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(15,118,110,0.08) 0%, transparent 70%);
  bottom: -120px; right: -160px;
  pointer-events: none;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  border: 1px solid rgba(20,33,43,0.12);
  background: rgba(255,255,255,0.55);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.hero-badge::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--pink-glow);
  box-shadow: 0 0 0 4px rgba(217,119,6,0.12);
}

.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  max-width: 900px;
  margin-bottom: 1.5rem;
}

.hero h1 em {
  font-style: normal;
  background: linear-gradient(135deg, #b45309 0%, #0f766e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-secondary);
  max-width: 520px;
  margin-bottom: 2.5rem;
  font-weight: 400;
  line-height: 1.72;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.hero-note {
  font-size: 0.86rem;
  color: var(--text-muted);
  max-width: 460px;
}

/* MAP MOCKUP */
.map-mockup {
  position: relative;
  width: 100%;
  max-width: 860px;
  aspect-ratio: 16/9;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(20,33,43,0.12);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.45),
    0 26px 50px rgba(20,33,43,0.14);
}

.map-inner {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #f3ede2 0%, #e8dfcf 100%);
}

/* MAP ROADS SVG */
.map-roads {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
}

/* SCAN LINE */
.map-scan {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(217,119,6,0.45), transparent);
  animation: scan 4s ease-in-out infinite;
}

@keyframes scan {
  0% { top: 0%; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* MAP LABELS */
.map-ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.map-label {
  position: absolute;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  color: rgba(70,81,93,0.7);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* DOT */
.dot-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
}

.dot-ring {
  position: absolute;
  border-radius: 50%;
  animation: ring-expand 2.4s ease-out infinite;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes ring-expand {
  0% { width: 12px; height: 12px; opacity: 0.9; }
  100% { width: 50px; height: 50px; opacity: 0; }
}

.dot-ring-2 {
  animation-delay: 0.9s;
}

.dot-core {
  width: 14px; height: 14px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.dot-label {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(245,239,228,0.94);
  border: 1px solid rgba(20,33,43,0.12);
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  color: var(--text-primary);
  letter-spacing: 0.04em;
}

/* Distance line */
.dist-line {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

/* Map overlay info */
.map-overlay-card {
  position: absolute;
  background: rgba(246,240,230,0.88);
  border: 1px solid rgba(20,33,43,0.12);
  border-radius: 10px;
  padding: 10px 14px;
  backdrop-filter: blur(10px);
  font-size: 11px;
}

.room-code-card {
  top: 16px; left: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.room-code-card .label {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.room-code-card .code {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
  letter-spacing: 0.12em;
}

.dist-card {
  bottom: 16px; right: 16px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.dist-card strong {
  color: var(--text-primary);
  font-weight: 500;
}

/* Live indicator */
.live-badge {
  position: absolute;
  top: 16px; right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(246,240,230,0.88);
  border: 1px solid rgba(20,33,43,0.12);
  border-radius: 100px;
  padding: 5px 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--pink-glow);
  box-shadow: 0 0 0 4px rgba(217,119,6,0.12);
  animation: pulse-dot 1s ease-in-out infinite;
}

/* Mockup bottom fade */
.map-mockup::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 40%;
  background: linear-gradient(transparent, rgba(20,33,43,0.05));
  pointer-events: none;
}

/* SECTION GENERIC */
section {
  position: relative;
  padding: 7rem 2rem;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple-glow);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-label::before {
  content: '';
  display: block;
  width: 28px; height: 1px;
  background: var(--purple-glow);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
}

.section-sub {
  color: var(--text-secondary);
  font-weight: 300;
  font-size: 1.05rem;
  max-width: 500px;
  line-height: 1.7;
}

/* HOW IT WORKS */
.how-section {
  background: rgba(255,255,255,0.22);
}

.how-section .grid-bg { opacity: 0.22; }

.process-list {
  margin-top: 3.5rem;
  border-top: 1px solid rgba(20,33,43,0.12);
}

.process-item {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) auto;
  gap: 1.25rem;
  padding: 1.35rem 0;
  border-bottom: 1px solid rgba(20,33,43,0.12);
  align-items: start;
}

.process-item:last-child {
  border-bottom: 0;
}

.process-index {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding-top: 0.15rem;
}

.process-copy h3 {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 0.35rem;
}

.process-copy p {
  color: var(--text-secondary);
  max-width: 44rem;
}

.step-number {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  color: rgba(20,33,43,0.08);
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
}

.step-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(20,33,43,0.1);
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
}

.step h3 {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.step p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.65;
}

.step-connector {
  display: none;
}

/* FEATURES */
.feature-layout {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 1rem;
}

.feature-spotlight,
.feature-stack {
  border: 1px solid rgba(20,33,43,0.12);
  border-radius: 12px;
  background: rgba(255,255,255,0.56);
  overflow: hidden;
}

.feature-spotlight {
  padding: 2rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-stack {
  display: grid;
}

.feature-row {
  padding: 1.1rem 1.2rem;
  border-bottom: 1px solid rgba(20,33,43,0.08);
}

.feature-row:last-child {
  border-bottom: 0;
}

.feature-row h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.feature-row p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1.25rem;
  display: block;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 1rem;
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.tag-purple {
  background: rgba(20,33,43,0.06);
  color: var(--text-secondary);
  border: 1px solid rgba(20,33,43,0.12);
}

.tag-pink {
  background: rgba(193,65,12,0.08);
  color: var(--purple-glow);
  border: 1px solid rgba(193,65,12,0.16);
}

/* CTA SECTION */
.cta-section {
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
}

.cta-bg-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(20,33,43,0.08);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.cta-section .section-label { justify-content: flex-start; }
.cta-section .section-label::before { display: none; }

.cta-card {
  max-width: 840px;
  margin: 0 auto;
  border: 1px solid rgba(20,33,43,0.12);
  border-radius: 16px;
  background: rgba(255,255,255,0.56);
  padding: 2rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: center;
}

.cta-section .section-title { font-size: clamp(2.2rem, 5vw, 4rem); }

.cta-section .section-sub {
  margin: 0;
  max-width: 420px;
}

/* FOOTER */
footer {
  padding: 2rem 3rem 3rem;
  border-top: 1px solid rgba(20,33,43,0.1);
}

.footer-inner {
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.footer-logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--text-secondary);
  letter-spacing: -0.02em;
}

.footer-copy {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 400;
}

/* SCROLL ANIMATIONS */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal.visible {
  opacity: 1;
  transform: none;
}

.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* MOBILE */
@media (max-width: 768px) {
  nav { padding: 1rem 1.25rem; }
  .nav-links { display: none; }
  .steps { grid-template-columns: 1fr; }
  .step-connector { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  footer { flex-direction: column; gap: 0.75rem; text-align: center; }
  section { padding: 5rem 1.25rem; }
  .hero { padding: 7rem 1.25rem 3rem; }
  .hero-ctas { flex-direction: column; align-items: stretch; }
  .hero-ctas .btn { justify-content: center; }
}

@media (max-width: 480px) {
  .map-label { display: none; }
}
`;

function MapMockup() {
  return (
    <div className="map-mockup reveal">
      <div className="map-inner">
        <div className="grid-bg" />
        <svg className="map-roads" viewBox="0 0 860 484" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="160" x2="860" y2="160" stroke="rgba(20,33,43,0.09)" strokeWidth="10"/>
          <line x1="0" y1="320" x2="860" y2="320" stroke="rgba(20,33,43,0.07)" strokeWidth="7"/>
          <line x1="200" y1="0" x2="200" y2="484" stroke="rgba(20,33,43,0.09)" strokeWidth="10"/>
          <line x1="600" y1="0" x2="600" y2="484" stroke="rgba(20,33,43,0.07)" strokeWidth="7"/>
          <line x1="0" y1="80" x2="860" y2="80" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="0" y1="240" x2="860" y2="240" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="0" y1="400" x2="860" y2="400" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="100" y1="0" x2="100" y2="484" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="350" y1="0" x2="350" y2="484" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="500" y1="0" x2="500" y2="484" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="720" y1="0" x2="720" y2="484" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <line x1="0" y1="484" x2="300" y2="0" stroke="rgba(20,33,43,0.05)" strokeWidth="3"/>
          <line x1="600" y1="0" x2="860" y2="240" stroke="rgba(20,33,43,0.04)" strokeWidth="2"/>
          <rect x="210" y="10" width="130" height="60" rx="2" fill="rgba(20,33,43,0.04)"/>
          <rect x="360" y="10" width="130" height="60" rx="2" fill="rgba(20,33,43,0.03)"/>
          <rect x="610" y="10" width="100" height="60" rx="2" fill="rgba(20,33,43,0.04)"/>
          <rect x="210" y="170" width="130" height="60" rx="2" fill="rgba(20,33,43,0.04)"/>
          <rect x="360" y="170" width="130" height="60" rx="2" fill="rgba(20,33,43,0.03)"/>
          <rect x="510" y="170" width="80" height="60" rx="2" fill="rgba(20,33,43,0.04)"/>
          <rect x="610" y="170" width="100" height="60" rx="2" fill="rgba(20,33,43,0.03)"/>
          <rect x="210" y="330" width="130" height="60" rx="2" fill="rgba(20,33,43,0.04)"/>
          <rect x="360" y="330" width="130" height="60" rx="2" fill="rgba(20,33,43,0.03)"/>
          <rect x="610" y="330" width="100" height="60" rx="2" fill="rgba(20,33,43,0.04)"/>
          <rect x="10" y="170" width="80" height="130" rx="2" fill="rgba(20,33,43,0.035)"/>
          <rect x="730" y="170" width="120" height="130" rx="2" fill="rgba(20,33,43,0.035)"/>
          <line x1="270" y1="265" x2="590" y2="155" stroke="rgba(193,65,12,0.28)" strokeWidth="1.5" strokeDasharray="6 5"/>
          <circle cx="270" cy="265" r="0" fill="none" stroke="rgba(20,33,43,0.42)" strokeWidth="1">
            <animate attributeName="r" from="8" to="32" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="270" cy="265" r="0" fill="none" stroke="rgba(20,33,43,0.42)" strokeWidth="1">
            <animate attributeName="r" from="8" to="32" dur="2s" begin="0.7s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin="0.7s" repeatCount="indefinite"/>
          </circle>
          <circle cx="270" cy="265" r="8" fill="rgba(193,65,12,0.2)"/>
          <circle cx="270" cy="265" r="5" fill="#b45309"/>
          <circle cx="270" cy="265" r="3" fill="#fff7ed"/>
          <rect x="246" y="233" width="48" height="20" rx="5" fill="rgba(245,239,228,0.94)" stroke="rgba(20,33,43,0.12)" strokeWidth="0.75"/>
          <text x="270" y="247" textAnchor="middle" fill="#14212b" fontSize="9" fontFamily="'DM Sans', sans-serif" fontWeight="500">Alex</text>
          <circle cx="590" cy="155" r="0" fill="none" stroke="rgba(15,118,110,0.38)" strokeWidth="1">
            <animate attributeName="r" from="8" to="32" dur="2s" begin="0.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin="0.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="590" cy="155" r="0" fill="none" stroke="rgba(15,118,110,0.38)" strokeWidth="1">
            <animate attributeName="r" from="8" to="32" dur="2s" begin="1.1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin="1.1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="590" cy="155" r="8" fill="rgba(15,118,110,0.18)"/>
          <circle cx="590" cy="155" r="5" fill="#0f766e"/>
          <circle cx="590" cy="155" r="3" fill="#ecfeff"/>
          <rect x="566" y="123" width="48" height="20" rx="5" fill="rgba(245,239,228,0.94)" stroke="rgba(20,33,43,0.12)" strokeWidth="0.75"/>
          <text x="590" y="137" textAnchor="middle" fill="#14212b" fontSize="9" fontFamily="'DM Sans', sans-serif" fontWeight="500">Jordan</text>
        </svg>
        <div className="map-scan" />
        <div className="map-overlay-card room-code-card">
          <span className="label">Room Code</span>
          <span className="code">NOVA-7734</span>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          Live
        </div>
        <div className="map-overlay-card dist-card">
          <span>📍</span>
          <span><strong>1.4 km</strong> apart</span>
        </div>
        <div className="map-ui">
          <span className="map-label" style={{top:'22px', left:'50%', transform:'translateX(-50%)'}}>Central District</span>
          <span className="map-label" style={{top:'45%', left:'12px'}}>West Ave</span>
          <span className="map-label" style={{bottom:'28px', left:'50%', transform:'translateX(-50%)'}}>Harbor Blvd</span>
        </div>
      </div>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function LandingPage() {
  useReveal();

  return (
    <>
      <style>{style}</style>
      <nav>
        <div className="nav-logo">
          <span />
          Arena
        </div>
        <ul className="nav-links">
          <li><a href="#how">How it Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#cta" className="btn btn-ghost" style={{padding:'0.5rem 1.1rem', fontSize:'0.85rem'}}>Get Started</a></li>
        </ul>
      </nav>
      <section className="hero">
        <div className="grid-bg" style={{opacity:0.18}} />
        <div className="hero-layout">
          <div className="hero-copy reveal">
            <div className="hero-kicker">Private room code · live map · no account</div>
            <h1>
              Meet up<br />
              <em>without the back-and-forth.</em>
            </h1>
            <p className="hero-sub">
              Share a room code and see each other on a live map. Built for quick meetups, not onboarding.
            </p>
            <div className="hero-ctas">
              <Link to="/code" className="btn btn-primary btn-large">
                Open a Room →
              </Link>
              <a href="#how" className="btn btn-ghost btn-large">
                See how it works
              </a>
            </div>
            <p className="hero-note">
              Two people, one code, one shared view. The interface stays out of the way.
            </p>
            <div className="hero-metrics">
              <div className="metric">
                <strong>12s</strong>
                <span>to open a room</span>
              </div>
              <div className="metric">
                <strong>1 tap</strong>
                <span>to share the code</span>
              </div>
              <div className="metric">
                <strong>Live</strong>
                <span>position updates</span>
              </div>
            </div>
          </div>

          <div className="hero-side reveal reveal-delay-1">
            <div className="hero-panel hero-panel-map">
              <MapMockup />
            </div>
            <div className="hero-panel hero-panel-summary">
              <div className="panel-label">Room details</div>
              <div className="room-details">
                <div className="room-row">
                  <span>Code</span>
                  <strong>NOVA-7734</strong>
                </div>
                <div className="room-row">
                  <span>Status</span>
                  <strong>2 people connected</strong>
                </div>
                <div className="room-row">
                  <span>Distance</span>
                  <strong>1.4 km apart</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="how-section" id="how">
        <div className="grid-bg" />
        <div className="container">
          <div className="reveal">
            <div className="section-label">How it works</div>
            <h2 className="section-title">A short path to the same place.</h2>
            <p className="section-sub">Open a room, send the code, and watch both dots move in real time.</p>
          </div>
          <div className="process-list">
            <div className="process-item reveal reveal-delay-1">
              <div className="process-index">01</div>
              <div className="process-copy">
                <h3>Create a room</h3>
                <p>Tap once and Arena generates a private room code. It is temporary, specific to that session, and easy to share.</p>
              </div>
              <div className="step-icon">🏟</div>
            </div>
            <div className="process-item reveal reveal-delay-2">
              <div className="process-index">02</div>
              <div className="process-copy">
                <h3>Share the code</h3>
                <p>Send the code by text or link. Your friend lands in the same room without creating an account.</p>
              </div>
              <div className="step-icon">📤</div>
            </div>
            <div className="process-item reveal reveal-delay-3">
              <div className="process-index">03</div>
              <div className="process-copy">
                <h3>See each other live</h3>
                <p>Both dots appear on the map and update in real time, which makes the next move obvious.</p>
              </div>
              <div className="step-icon">🗺</div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" style={{background: 'var(--navy)'}}>
        <div className="container">
          <div className="reveal">
            <div className="section-label">Features</div>
            <h2 className="section-title">Useful, not overworked.</h2>
            <p className="section-sub">Just enough detail to keep the experience clear, private, and fast.</p>
          </div>
          <div className="feature-layout">
            <article className="feature-spotlight reveal reveal-delay-1">
              <div>
                <span className="feature-icon">⚡</span>
                <h3>Real-time GPS tracking</h3>
                <p>Positions sync every second via WebSocket. When you move, your dot moves, which keeps the room useful instead of flashy.</p>
              </div>
              <div className="feature-tag tag-purple">Sub-200ms sync</div>
            </article>
            <div className="feature-stack">
              <div className="feature-row reveal reveal-delay-2">
                <h3>Works on any device</h3>
                <p>Open in Safari, Chrome, or Firefox. No download and no OS lock-in.</p>
              </div>
              <div className="feature-row reveal reveal-delay-3">
                <h3>No sign-up needed</h3>
                <p>People join with a code, not an account. It keeps the flow simple.</p>
              </div>
              <div className="feature-row reveal reveal-delay-4">
                <h3>Private rooms</h3>
                <p>Only people with the exact room code can join, and rooms disappear when they are done.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section" id="cta">
        {[180,320,460,600,740].map((s,i) => (
          <div key={i} className="cta-bg-ring" style={{width:`${s}px`, height:`${s}px`}} />
        ))}
        <div className="container" style={{position:'relative', zIndex:1}}>
          <div className="cta-card reveal">
            <div>
              <div className="section-label">Ready?</div>
              <h2 className="section-title" style={{marginBottom:'0.9rem'}}>
                Open a room
              </h2>
              <p className="section-sub">
                Share the code, start moving, and keep the experience simple.
              </p>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'0.9rem', alignItems:'flex-start'}}>
              <Link to="/code" className="btn btn-primary btn-large" style={{minWidth:'190px'}}>
                Open a Room →
              </Link>
              <p style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                No account. No clutter. Nothing extra.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-logo">Arena</div>
            <div className="footer-copy">© 2026 Arena. Find each other.</div>
          </div>
          <div style={{display:'flex', gap:'1.25rem'}}>
            {['Privacy','Terms','Contact'].map(t => (
                <Link key={t} to={`/${t.toLowerCase()}`} style={{
                fontSize:'0.78rem',
                color:'var(--text-muted)',
                textDecoration:'none',
                transition:'color 0.2s'
              }}
              onMouseEnter={e=>e.target.style.color='var(--text-secondary)'}
              onMouseLeave={e=>e.target.style.color='var(--text-muted)'}
                >{t}</Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
