/**
 * flip-cards.js
 * Data-driven flip-card grid for Rishab's portfolio.
 * Pure vanilla JS — no framework dependency.
 */

(function () {
  "use strict";

  /* ── Project data ──────────────────────────────────────────────── */
  const PROJECTS = [
    {
      id: "ai-interview",
      title: "AI-Based Voice Interview System",
      image: "./assests/AI Voice Interview System - Practice Interviews with AI.png",
      description:
        "An interactive voice-powered platform simulating real technical interviews. Uses Advanced Speech-to-Text and NLP to analyze speech metrics, evaluate communication skills, and deliver instant AI performance scoring.",
      features: [
        "Real-time speech evaluation & communication analysis",
        "Context-aware AI interviewer follow-up questions",
        "Detailed scoring metrics & improvement suggestions"
      ],
      tools: ["React", "Node.js", "MongoDB", "TTS/STT", "NLP", "Express"],
      link: "https://github.com/rishab0003/ai-voice-interview-system",
      slot: "wide",          // grid-column variant: wide | narrow | half | third
      aspect: "wide",        // aspect-ratio variant: wide | square | tall
      longScreenshot: true,
    },
    {
      id: "smart-dashboard",
      title: "Smart Analytics Dashboard",
      image: "./assests/SmartAnalyticsDash.png",
      description:
        "A predictive intelligence dashboard for analyzing business KPIs and trend metrics. Integrates machine learning algorithms to generate interactive forecasts and data charts.",
      features: [
        "XGBoost predictive forecasting model training",
        "Interactive Plotly chart rendering & KPI cards",
        "Exploratory data analysis pipelines in Pandas"
      ],
      tools: ["Python", "Scikit-learn", "XGBoost", "Pandas", "Plotly"],
      link: "https://smart-dashboard-frontend-qafh.onrender.com/",
      slot: "narrow",
      aspect: "square",
      longScreenshot: false,
    },
    {
      id: "querysafe",
      title: "QuerySafe — AI Database Assistant",
      image: "./assests/QuerySafe — AI-Powered Database Interface.png",
      description:
        "A natural language interface allowing non-technical users to query databases securely. Uses LLM sanitization rules to parse English queries into safe SQL queries, blocking malicious SQL injections.",
      features: [
        "Natural Language to SQL translation via LangChain",
        "Rigorous safety guardrails & SQL validation layers",
        "Dynamic query result tables and download utilities"
      ],
      tools: ["Python", "FastAPI", "Next.js", "LangChain", "PostgreSQL"],
      link: "https://github.com/rishab0003/QuerySafe",
      slot: "narrow",
      aspect: "square",
      longScreenshot: true,
    },
    {
      id: "oic-ai",
      title: "Enterprise AI & OIC Integration",
      image: "./assests/ShrituAiDashProject.png",
      description:
        "An enterprise automation pipeline built during an R&D internship. Connects Oracle Integration Cloud services with custom machine learning APIs to streamline database updates and business actions.",
      features: [
        "Oracle OIC recipe triggers & REST endpoint mapping",
        "Automated workflow pipeline with ML analytics",
        "Robust enterprise error logging and monitoring systems"
      ],
      tools: ["Oracle OIC", "REST APIs", "AI/ML", "Python", "Cloud"],
      link: "https://github.com/rishab0003/OIC-AI",
      slot: "wide",
      aspect: "wide",
      longScreenshot: false,
    },
  ];

  /* Slot → grid-column CSS class mapping */
  const SLOT_CLASS = {
    wide:   "fc-item--wide",
    narrow: "fc-item--narrow",
    half:   "fc-item--half",
    third:  "fc-item--third",
    full:   "fc-item--full",
  };

  /* Aspect-ratio → scene CSS class mapping */
  const ASPECT_CLASS = {
    wide:   "fc-card-scene--wide",
    square: "fc-card-scene--square",
    tall:   "fc-card-scene--tall",
  };

  /* ── SVG helpers ───────────────────────────────────────────────── */
  const svg = (path, extra = "") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${path}</svg>`;

  const SVG_FLIP  = svg('<path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>');
  const SVG_CLOSE = svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>');
  const SVG_ARROW = svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>');
  const SVG_GH    = svg('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>');

  /* ── Card builder ──────────────────────────────────────────────── */
  function buildCard(project) {
    const pills = project.tools
      .map(t => `<span class="fc-pill">${t}</span>`)
      .join("");

    const featuresList = project.features
      ? `<ul class="fc-back-features">${project.features.map(f => `<li>${f}</li>`).join("")}</ul>`
      : "";

    return `
      <div class="${SLOT_CLASS[project.slot] || "fc-item--half"}">
        <div
          class="fc-card-scene ${ASPECT_CLASS[project.aspect] || "fc-card-scene--wide"}"
          role="button"
          tabindex="0"
          aria-pressed="false"
          aria-label="Flip card: ${project.title}"
          data-id="${project.id}"
        >
          <!-- Inner (rotates) -->
          <div class="fc-card-inner">

            <!-- FRONT face -->
            <div class="fc-face fc-face--front ${project.longScreenshot ? "is-long-screenshot" : ""}">
              <img
                src="${project.image}"
                alt="${project.title}"
                loading="lazy"
                draggable="false"
              />
              <div class="fc-front-overlay">
                <h3 class="fc-front-title">${project.title}</h3>
              </div>
              <span class="fc-flip-hint" aria-hidden="true">${SVG_FLIP}</span>
            </div>

            <!-- BACK face -->
            <div class="fc-face fc-face--back" aria-hidden="true">
              <button
                class="fc-close-btn"
                tabindex="-1"
                aria-label="Close"
                data-close="${project.id}"
              >${SVG_CLOSE}</button>
              <h3 class="fc-back-title">${project.title}</h3>
              <p class="fc-back-desc">${project.description}</p>
              ${featuresList}
              <div class="fc-pills">${pills}</div>
              <a
                href="${project.link}"
                target="_blank"
                rel="noopener noreferrer"
                class="fc-view-btn"
                tabindex="-1"
              >View Project ${SVG_ARROW}</a>
            </div>

          </div><!-- /card-inner -->
        </div><!-- /card-scene -->
      </div><!-- /grid-item -->
    `;
  }


  /* ── Flip controller ───────────────────────────────────────────── */
  function initFlipCards(container) {
    const scenes = container.querySelectorAll(".fc-card-scene");

    scenes.forEach(scene => {
      /* Click / Enter / Space on scene = flip */
      scene.addEventListener("click", e => {
        // Ignore clicks that originated on the close button or view-project link
        if (e.target.closest(".fc-close-btn") || e.target.closest(".fc-view-btn")) return;
        toggleFlip(scene);
      });

      scene.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!e.target.closest(".fc-close-btn")) toggleFlip(scene);
        }
        if (e.key === "Escape" && scene.classList.contains("is-flipped")) {
          unflip(scene);
        }
      });

      /* Close button */
      const closeBtn = scene.querySelector(".fc-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", e => {
          e.stopPropagation();
          unflip(scene);
        });
        closeBtn.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            unflip(scene);
          }
        });
      }
    });
  }

  function toggleFlip(scene) {
    const flipped = scene.classList.toggle("is-flipped");
    scene.setAttribute("aria-pressed", String(flipped));

    const back = scene.querySelector(".fc-face--back");
    const front = scene.querySelector(".fc-face--front");

    if (flipped) {
      back.removeAttribute("aria-hidden");
      front.setAttribute("aria-hidden", "true");
      /* Allow interactive elements on back to receive tab focus */
      scene.querySelectorAll(".fc-close-btn, .fc-view-btn").forEach(el => el.removeAttribute("tabindex"));
    } else {
      back.setAttribute("aria-hidden", "true");
      front.removeAttribute("aria-hidden");
      scene.querySelectorAll(".fc-close-btn, .fc-view-btn").forEach(el => el.setAttribute("tabindex", "-1"));
    }
  }

  function unflip(scene) {
    scene.classList.remove("is-flipped");
    scene.setAttribute("aria-pressed", "false");
    const back = scene.querySelector(".fc-face--back");
    const front = scene.querySelector(".fc-face--front");
    back.setAttribute("aria-hidden", "true");
    front.removeAttribute("aria-hidden");
    scene.querySelectorAll(".fc-close-btn, .fc-view-btn").forEach(el => el.setAttribute("tabindex", "-1"));
    scene.focus({ preventScroll: true });
  }

  /* ── Mount ─────────────────────────────────────────────────────── */
  function mount() {
    /* 1. Build & wire the projects grid */
    const root = document.getElementById("fc-projects-root");
    if (root) {
      root.innerHTML = `
        <div class="fc-section-header">
          <h2>Featured engineering &amp; AI projects</h2>
          <a
            href="https://github.com/rishab0003"
            target="_blank"
            rel="noopener noreferrer"
            class="fc-github-btn"
            aria-label="View GitHub profile"
          >${SVG_GH} GitHub Profile</a>
        </div>
        <div class="fc-grid" role="list" aria-label="Project cards">
          ${PROJECTS.map(buildCard).join("")}
        </div>
      `;
      initFlipCards(root);
    }

    /* 2. Wire the static workspace flip cards in .section-social-media */
    const workspaceSection = document.querySelector(".section-social-media");
    if (workspaceSection) {
      initFlipCards(workspaceSection);
    }

    /* 3. Wire the services flip cards in .section-services */
    const servicesSection = document.querySelector(".section-services");
    if (servicesSection) {
      initFlipCards(servicesSection);
    }
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

