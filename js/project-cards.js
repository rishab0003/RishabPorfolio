/**
 * Project Cards Image Overlay Controller - Injects details inside the image boundary and manages toggles.
 */
class ProjectCards {
  constructor() {
    this.projectsData = {
      'AI-Based Voice Interview System': {
        tags: ['MERN Stack', 'Python', 'OpenAI Whisper', 'LangChain', 'FastAPI'],
        description: 'A full-stack artificial intelligence application designed to automate technical screenings. By matching CV criteria against job profiles, the system generates custom interview flows, processes audio responses, and grades technical knowledge.',
        features: [
          'Dynamic resume-based interview generation using LLMs.',
          'High-accuracy audio transcription (STT) via OpenAI Whisper.',
          'Semantic grading of answers using advanced NLP pipelines.',
          'Dashboard showing transcripts and speech scores.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      },
      'Smart Analytics Dashboard': {
        tags: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Flask', 'Chart.js'],
        description: 'A business intelligence platform designed to ingest raw transactional data. It runs predictive regression models and tree-based behaviors to display client churn, purchase telemetry, and key operational gauges.',
        features: [
          'Behavioral clustering grouping customer profiles by retention value.',
          'Interactive forecasting engine showing projected sales curves.',
          'High-performance CSV analytics engine parsing large logs.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      },
      'QuerySafe — AI Database Assistant': {
        tags: ['Python', 'FastAPI', 'Next.js', 'LangChain', 'PostgreSQL'],
        description: 'An AI assistant built to bridge the gap between business managers and databases. The tool translates plain English queries into safe SQL, runs them within sandbox limits, and documents database records.',
        features: [
          'NL-to-SQL query conversion using LangChain prompt models.',
          'AST SQL parsing blocking drop, delete, or update modifications.',
          'Intelligent conversational memory explaining database schemas.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      },
      'Enterprise AI & OIC Integration': {
        tags: ['Oracle OIC', 'Service Bus', 'REST APIs', 'SOAP APIs', 'Python'],
        description: 'Completed during a research internship at Shritu Technology. Built cloud interfaces connecting relational databases with cloud systems to coordinate data transfers and structure documentation.',
        features: [
          'Configured complex Oracle Integration Cloud data flows.',
          'Built custom REST/SOAP API adapters for legacy webhooks.',
          'Automated classification pipelines reducing sorting times.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      }
    };

    this.init();
  }

  init() {
    const cards = document.querySelectorAll('.portfolio-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
      const titleEl = card.querySelector('.heading-style-h6');
      if (!titleEl) return;

      const title = titleEl.textContent.trim();
      const data = this.projectsData[title];
      if (!data) return;

      // Find the image wrapper target for details injection
      const imageWrapper = card.querySelector('.portfolio-image-wrapper');
      if (!imageWrapper) return;

      // Find the content block for injecting the indicator label
      const contentBlock = card.querySelector('.portfolio-card-content');

      // 1. Inject details overlay container inside the image wrapper
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'portfolio-card-details';

      let tagsHTML = '';
      data.tags.forEach(tag => {
        tagsHTML += `<span class="portfolio-card-tag">${tag}</span>`;
      });

      let featuresHTML = '';
      data.features.forEach(feat => {
        featuresHTML += `<li>${feat}</li>`;
      });

      detailsDiv.innerHTML = `
        <div class="portfolio-card-scroll-area">
          <p class="portfolio-card-desc">${data.description}</p>
          <div class="portfolio-card-features-title">Core Implementations</div>
          <ul class="portfolio-card-features">${featuresHTML}</ul>
          <div class="portfolio-card-tags">${tagsHTML}</div>
        </div>
        <div class="portfolio-card-actions">
          <a href="${data.codeUrl}" target="_blank" class="portfolio-card-btn is-primary">Explore Source Code</a>
        </div>
      `;

      imageWrapper.appendChild(detailsDiv);

      // 2. Inject indicator label at the bottom of the card content if it exists
      let indicator = null;
      if (contentBlock) {
        indicator = document.createElement('div');
        indicator.className = 'portfolio-card-indicator';
        indicator.textContent = 'View Details';
        contentBlock.appendChild(indicator);
      }

      // 3. Bind click events
      card.addEventListener('click', (e) => {
        // If the user clicked the action button/link inside the overlay details, do not toggle collapse
        if (e.target.closest('.portfolio-card-actions')) {
          return; 
        }

        e.preventDefault();
        this.toggleCard(card, indicator);
      });
    });
  }

  toggleCard(card, indicator) {
    const isExpanded = card.classList.contains('is-expanded');

    // Collapse all other cards first to keep layout clean (accordion style)
    document.querySelectorAll('.portfolio-card.is-expanded').forEach(otherCard => {
      if (otherCard !== card) {
        otherCard.classList.remove('is-expanded');
        const otherIndicator = otherCard.querySelector('.portfolio-card-indicator');
        if (otherIndicator) otherIndicator.textContent = 'View Details';
      }
    });

    if (isExpanded) {
      card.classList.remove('is-expanded');
      if (indicator) indicator.textContent = 'View Details';
    } else {
      card.classList.add('is-expanded');
      if (indicator) indicator.textContent = 'Close Details';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProjectCards());
} else {
  new ProjectCards();
}
