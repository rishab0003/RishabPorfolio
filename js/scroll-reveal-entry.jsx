import React from 'react';
import { createRoot } from 'react-dom/client';
import ScrollReveal from './ScrollReveal.jsx';

// Initialize What I Build Section Header
const buildContainer = document.getElementById('what-i-build-reveal-target');
if (buildContainer) {
  buildContainer.innerHTML = '';
  const root = createRoot(buildContainer);
  root.render(
    <React.StrictMode>
      <h2 className="heading-style-h2" id="what-i-build-heading" style={{ borderLeft: '4px solid #faff79', paddingLeft: '0.85rem' }}>
        What I Build
      </h2>
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={3}
        blurStrength={10}
        textClassName="scroll-reveal-text"
      >
        Building intelligent software that combines engineering excellence, scalable architecture, and AI-driven innovation.
      </ScrollReveal>
    </React.StrictMode>
  );
}

// Initialize Tech Focus Section Header
const techContainer = document.getElementById('tech-focus-reveal-target');
if (techContainer) {
  techContainer.innerHTML = '';
  const root = createRoot(techContainer);
  root.render(
    <React.StrictMode>
      <h2 className="heading-style-h2" id="tech-focus-heading" style={{ borderLeft: '4px solid #faff79', paddingLeft: '0.85rem' }}>
        Tech Focus
      </h2>
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={3}
        blurStrength={10}
        textClassName="scroll-reveal-text"
      >
        My technical interests span multiple domains of software engineering, allowing me to build complete solutions—from intelligent algorithms and scalable backend systems to modern web applications and production-ready deployments.
      </ScrollReveal>
    </React.StrictMode>
  );
}
