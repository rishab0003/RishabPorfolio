/**
 * Project Details Specs Drawer - GSAP Animated sliding panel for projects (Restored).
 */
class ProjectDrawer {
  constructor() {
    this.projectsData = {
      'AI-Based Voice Interview System': {
        subtitle: 'MERN Stack • NLP • TTS/STT',
        tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Python', 'OpenAI Whisper', 'LangChain', 'FastAPI'],
        description: 'A full-stack artificial intelligence application designed to automate candidate technical screenings. By matching CV criteria against customizable job profiles, the system generates interview workflows, processes audio responses, and grades candidates interactively.',
        features: [
          'Dynamic AI-generated technical questions based on candidate experience profiles.',
          'High-accuracy audio transcription (Speech-to-Text) using OpenAI Whisper models.',
          'Semantic grading of candidates\' answers using advanced NLP algorithms.',
          'Text-to-Speech (TTS) vocal engine simulating a live interviewer personality.',
          'Comprehensive dashboard showing evaluation metrics, grading criteria, and transcripts.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      },
      'Smart Analytics Dashboard': {
        subtitle: 'Python • Scikit-learn • XGBoost',
        tags: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Flask', 'Chart.js', 'Data Science'],
        description: 'A data modeling and business intelligence platform designed to ingest raw transactional datasets and render diagnostic metrics. The tool executes regression and tree-based forecasting models to provide insights into user behavioral trends.',
        features: [
          'Behavioral clustering models grouping customer profiles by lifetime value.',
          'Interactive forecasting engine visualizing projected sales trends and customer churn.',
          'Optimized database aggregation pipeline capable of processing large CSV logs.',
          'Clean analytics board showing key performance gauges and transactional logs.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      },
      'QuerySafe — AI Database Assistant': {
        subtitle: 'Python • FastAPI • Next.js • LangChain',
        tags: ['Python', 'FastAPI', 'Next.js', 'LangChain', 'PostgreSQL', 'AST Parsing'],
        description: 'An AI-powered database assistant designed to bridge the gap between business managers and relational databases. The system translates plain English queries into safe, read-only SQL commands, executes them within sandbox limits, and explains schemas.',
        features: [
          'NL-to-SQL query conversion using structured LangChain prompts.',
          'AST SQL parsing to detect and block destructive modifications (DROP, UPDATE, DELETE).',
          'Intelligent schema explanations and schema-aware auto-completion suggestions.',
          'Secure execution sandbox preventing query timeouts and excessive resource usage.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      },
      'Enterprise AI & OIC Integration': {
        subtitle: 'Oracle OIC • Service Bus • REST/SOAP APIs',
        tags: ['Oracle OIC', 'Service Bus', 'REST APIs', 'SOAP APIs', 'Python', 'Enterprise Integration'],
        description: 'Completed during a research internship at Shritu Technology. Constructed cloud integration interfaces linking legacy databases with Oracle Integration Cloud (OIC) to coordinate enterprise transactions and optimize telemetry flows.',
        features: [
          'Configured enterprise integration workflows in Oracle Integration Cloud.',
          'Built custom REST/SOAP API adapters to interface with legacy database backends.',
          'Automated data ingestion pipelines reducing message processing times.',
          'Developed structured XML/JSON payload transformers for multi-system compatibility.'
        ],
        codeUrl: 'https://github.com/rishab0003'
      }
    };

    this.drawerEl = null;
    this.init();
  }

  init() {
    this.createDrawerDOM();
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const titleEl = card.querySelector('.heading-style-h6');
        if (!titleEl) return;
        
        const title = titleEl.textContent.trim();
        this.openDrawer(title);
      });
    });
  }

  createDrawerDOM() {
    this.drawerEl = document.createElement('div');
    this.drawerEl.className = 'project-drawer';
    this.drawerEl.style.display = 'none';

    this.drawerEl.innerHTML = `
      <div class="project-drawer-overlay"></div>
      <div class="project-drawer-content">
        <button class="project-drawer-close" aria-label="Close drawer">&times;</button>
        <div class="project-drawer-scroll">
          <h2 class="project-drawer-title"></h2>
          <div class="project-drawer-subtitle"></div>
          <p class="project-drawer-desc"></p>
          <div class="project-drawer-features-section">
            <h3 class="project-drawer-features-title">Core Implementations</h3>
            <ul class="project-drawer-features"></ul>
          </div>
          <div class="project-drawer-tags"></div>
          <div class="project-drawer-actions">
            <a href="" target="_blank" class="project-drawer-btn is-primary">Explore Source Code</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.drawerEl);

    // Bind close events
    const closeBtn = this.drawerEl.querySelector('.project-drawer-close');
    const overlay = this.drawerEl.querySelector('.project-drawer-overlay');

    closeBtn.addEventListener('click', () => this.closeDrawer());
    overlay.addEventListener('click', () => this.closeDrawer());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawerEl.style.display === 'block') {
        this.closeDrawer();
      }
    });
  }

  openDrawer(title) {
    const data = this.projectsData[title];
    if (!data) return;

    // Populate data
    this.drawerEl.querySelector('.project-drawer-title').textContent = title;
    this.drawerEl.querySelector('.project-drawer-subtitle').textContent = data.subtitle;
    this.drawerEl.querySelector('.project-drawer-desc').textContent = data.description;

    const featuresList = this.drawerEl.querySelector('.project-drawer-features');
    featuresList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      featuresList.appendChild(li);
    });

    const tagsContainer = this.drawerEl.querySelector('.project-drawer-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'project-drawer-tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    const actionBtn = this.drawerEl.querySelector('.project-drawer-btn');
    actionBtn.href = data.codeUrl;

    // Animations using GSAP
    if (window.gsap) {
      window.gsap.killTweensOf(['.project-drawer-overlay', '.project-drawer-content']);
      window.gsap.set(this.drawerEl, { display: 'block' });
      window.gsap.fromTo('.project-drawer-overlay', 
        { opacity: 0 }, 
        { opacity: 0.5, duration: 0.4, ease: 'power2.out' }
      );
      window.gsap.fromTo('.project-drawer-content', 
        { xPercent: 100 }, 
        { xPercent: 0, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      this.drawerEl.style.display = 'block';
    }
  }

  closeDrawer() {
    if (window.gsap) {
      window.gsap.killTweensOf(['.project-drawer-overlay', '.project-drawer-content']);
      window.gsap.to('.project-drawer-overlay', { 
        opacity: 0, 
        duration: 0.4, 
        ease: 'power2.in' 
      });
      window.gsap.to('.project-drawer-content', { 
        xPercent: 100, 
        duration: 0.5, 
        ease: 'power3.in',
        onComplete: () => {
          this.drawerEl.style.display = 'none';
        }
      });
    } else {
      this.drawerEl.style.display = 'none';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProjectDrawer());
} else {
  new ProjectDrawer();
}
