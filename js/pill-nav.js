class PillNav {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('PillNav target container not found');
      return;
    }

    this.logo = options.logo;
    this.logoAlt = options.logoAlt || 'Logo';
    this.items = options.items || [];
    this.activeHref = options.activeHref;
    this.className = options.className || '';
    this.ease = options.ease || 'power3.easeOut';
    
    // Theme colors matching React Bits props
    this.baseColor = options.baseColor || '#fff';
    this.pillColor = options.pillColor || '#120F17';
    this.hoveredPillTextColor = options.hoveredPillTextColor || '#120F17';
    this.pillTextColor = options.pillTextColor || this.baseColor;

    this.onMobileMenuClick = options.onMobileMenuClick;
    this.initialLoadAnimation = options.initialLoadAnimation !== false;

    this.isMobileMenuOpen = false;
    this.circleRefs = [];
    this.tlRefs = [];
    this.activeTweenRefs = [];
    this.logoImgRef = null;
    this.logoTweenRef = null;
    this.hamburgerRef = null;
    this.mobileMenuRef = null;
    this.navItemsRef = null;
    this.logoRef = null;

    this.init();
  }

  init() {
    this.container.innerHTML = '';

    const containerDiv = document.createElement('div');
    containerDiv.className = 'pill-nav-container';

    const nav = document.createElement('nav');
    nav.className = `pill-nav ${this.className}`;
    nav.setAttribute('aria-label', 'Primary');

    // Apply CSS Variables
    nav.style.setProperty('--base', this.baseColor);
    nav.style.setProperty('--pill-bg', this.pillColor);
    nav.style.setProperty('--hover-text', this.hoveredPillTextColor);
    nav.style.setProperty('--pill-text', this.pillTextColor);

    // Create Logo link
    const logoLink = document.createElement('a');
    logoLink.className = 'pill-logo';
    logoLink.href = this.items[0]?.href || '#';
    logoLink.setAttribute('aria-label', 'Home');

    if (this.logo) {
      const logoImg = document.createElement('img');
      logoImg.src = this.logo;
      logoImg.alt = this.logoAlt;
      logoLink.appendChild(logoImg);
      this.logoImgRef = logoImg;

      logoLink.addEventListener('mouseenter', () => this.handleLogoEnter());
    } else {
      logoLink.classList.add('is-text');
      const logoSpan = document.createElement('span');
      logoSpan.style.fontFamily = 'var(--font--heading-font)';
      logoSpan.style.fontSize = '0.95rem';
      logoSpan.style.fontWeight = '700';
      logoSpan.style.letterSpacing = '-0.3px';
      logoSpan.style.textTransform = 'uppercase';
      logoSpan.style.color = this.pillColor;
      logoSpan.textContent = this.logoAlt;
      logoLink.appendChild(logoSpan);

      // Initialize scramble-decrypt animation on hover
      if (window.DecryptedText) {
        new window.DecryptedText(logoSpan, {
          animateOn: 'hover',
          speed: 40,
          maxIterations: 8,
          sequential: true,
          className: 'revealed-char',
          encryptedClassName: 'encrypted-char'
        });
      }

      // Hover scale animation for text-logo
      logoLink.addEventListener('mouseenter', () => {
        gsap.to(logoLink, { scale: 1.05, duration: 0.3, ease: this.ease, overwrite: 'auto' });
      });
      logoLink.addEventListener('mouseleave', () => {
        gsap.to(logoLink, { scale: 1.0, duration: 0.2, ease: this.ease, overwrite: 'auto' });
      });
    }

    this.logoRef = logoLink;
    nav.appendChild(logoLink);

    // Desktop Nav Items
    const navItemsDiv = document.createElement('div');
    navItemsDiv.className = 'pill-nav-items desktop-only';
    this.navItemsRef = navItemsDiv;

    const ul = document.createElement('ul');
    ul.className = 'pill-list';
    ul.setAttribute('role', 'menubar');

    this.items.forEach((item, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');

      const a = document.createElement('a');
      a.setAttribute('role', 'menuitem');
      a.href = item.href;
      a.className = `pill${this.activeHref === item.href ? ' is-active' : ''}`;
      a.setAttribute('aria-label', item.ariaLabel || item.label);

      const circle = document.createElement('span');
      circle.className = 'hover-circle';
      circle.setAttribute('aria-hidden', 'true');
      this.circleRefs[i] = circle;

      const labelStack = document.createElement('span');
      labelStack.className = 'label-stack';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'pill-label';
      labelSpan.textContent = item.label;

      const hoverSpan = document.createElement('span');
      hoverSpan.className = 'pill-label-hover';
      hoverSpan.setAttribute('aria-hidden', 'true');
      hoverSpan.textContent = item.label;

      labelStack.appendChild(labelSpan);
      labelStack.appendChild(hoverSpan);

      a.appendChild(circle);
      a.appendChild(labelStack);

      a.addEventListener('mouseenter', () => this.handleEnter(i));
      a.addEventListener('mouseleave', () => this.handleLeave(i));

      li.appendChild(a);
      ul.appendChild(li);
    });

    navItemsDiv.appendChild(ul);
    nav.appendChild(navItemsDiv);

    // Mobile Menu Button
    const burgerBtn = document.createElement('button');
    burgerBtn.className = 'mobile-menu-button mobile-only';
    burgerBtn.setAttribute('aria-label', 'Toggle menu');

    const line1 = document.createElement('span');
    line1.className = 'hamburger-line';
    const line2 = document.createElement('span');
    line2.className = 'hamburger-line';

    burgerBtn.appendChild(line1);
    burgerBtn.appendChild(line2);

    burgerBtn.addEventListener('click', () => this.toggleMobileMenu());
    this.hamburgerRef = burgerBtn;
    nav.appendChild(burgerBtn);

    containerDiv.appendChild(nav);

    // Mobile Menu Popover
    const popover = document.createElement('div');
    popover.className = 'mobile-menu-popover mobile-only';
    popover.style.setProperty('--base', this.baseColor);
    popover.style.setProperty('--pill-bg', this.pillColor);
    popover.style.setProperty('--hover-text', this.hoveredPillTextColor);
    popover.style.setProperty('--pill-text', this.pillTextColor);
    this.mobileMenuRef = popover;

    const mobileUl = document.createElement('ul');
    mobileUl.className = 'mobile-menu-list';

    this.items.forEach((item, i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.className = `mobile-menu-link${this.activeHref === item.href ? ' is-active' : ''}`;
      a.textContent = item.label;

      a.addEventListener('click', () => {
        this.closeMobileMenu();
      });

      li.appendChild(a);
      mobileUl.appendChild(li);
    });

    popover.appendChild(mobileUl);
    containerDiv.appendChild(popover);

    this.container.appendChild(containerDiv);

    // Calculate layout parameters
    this.layout();
    setTimeout(() => this.layout(), 100);

    this.resizeHandler = () => this.layout();
    window.addEventListener('resize', this.resizeHandler);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.layout()).catch(() => {});
    }

    if (this.mobileMenuRef) {
      gsap.set(this.mobileMenuRef, { visibility: 'hidden', opacity: 0, scaleY: 1 });
    }

    if (this.initialLoadAnimation) {
      this.runInitialLoadAnimation();
    }

    // Scroll active link observer
    this.setupScrollObserver();

    // Scroll opacity adjustment
    this.setupScrollOpacity();
  }

  layout() {
    this.circleRefs.forEach((circle, index) => {
      if (!circle || !circle.parentElement) return;

      const pill = circle.parentElement;
      const rect = pill.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w === 0 || h === 0) return;

      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector('.pill-label');
      const hoverLabel = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

      if (this.tlRefs[index]) {
        this.tlRefs[index].kill();
      }

      const tl = gsap.timeline({ paused: true });
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: this.ease, overwrite: 'auto' }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 2, ease: this.ease, overwrite: 'auto' }, 0);
      }

      if (hoverLabel) {
        gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: this.ease, overwrite: 'auto' }, 0);
      }

      this.tlRefs[index] = tl;
    });
  }

  handleEnter(i) {
    if (!this.tlRefs[i]) {
      this.layout();
    }
    const tl = this.tlRefs[i];
    if (!tl) return;

    if (this.activeTweenRefs[i]) {
      this.activeTweenRefs[i].kill();
    }
    this.activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  handleLeave(i) {
    if (!this.tlRefs[i]) {
      this.layout();
    }
    const tl = this.tlRefs[i];
    if (!tl) return;

    if (this.activeTweenRefs[i]) {
      this.activeTweenRefs[i].kill();
    }
    this.activeTweenRefs[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  handleLogoEnter() {
    const img = this.logoImgRef;
    if (!img) return;

    if (this.logoTweenRef) {
      this.logoTweenRef.kill();
    }
    gsap.set(img, { rotate: 0 });
    this.logoTweenRef = gsap.to(img, {
      rotate: 360,
      duration: 0.5,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  toggleMobileMenu() {
    const newState = !this.isMobileMenuOpen;
    this.isMobileMenuOpen = newState;

    const hamburger = this.hamburgerRef;
    const menu = this.mobileMenuRef;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: this.ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: this.ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: this.ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: this.ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease: this.ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease: this.ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    // Force opacity to 1 when mobile popover is open
    const navContainer = this.container.querySelector('.pill-nav-container');
    if (navContainer) {
      if (newState) {
        navContainer.style.opacity = '1';
      } else if (this.isNavbarDimmed && !this.isHoveringNavbar) {
        navContainer.style.opacity = '0.35';
      }
    }

    if (this.onMobileMenuClick) {
      this.onMobileMenuClick();
    }
  }

  closeMobileMenu() {
    if (!this.isMobileMenuOpen) return;
    this.toggleMobileMenu();
  }

  runInitialLoadAnimation() {
    const logo = this.logoRef;
    const navItems = this.navItemsRef;

    if (logo) {
      gsap.set(logo, { scale: 0 });
      gsap.to(logo, {
        scale: 1,
        duration: 0.6,
        ease: this.ease
      });
    }

    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, {
        width: 'auto',
        duration: 0.6,
        ease: this.ease
      });
    }
  }

  setActiveHref(href) {
    this.activeHref = href;

    // Update desktop active links
    const pills = this.container.querySelectorAll('.pill');
    pills.forEach((pill) => {
      const linkHref = pill.getAttribute('href');
      if (linkHref === href) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    // Update mobile active links
    const mobileLinks = this.container.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref === href) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  setupScrollObserver() {
    const sections = this.items
      .map(item => item.href.startsWith('#') ? document.querySelector(item.href) : null)
      .filter(Boolean);

    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.setActiveHref('#' + id);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  setupScrollOpacity() {
    const navContainer = this.container.querySelector('.pill-nav-container');
    if (!navContainer) return;

    this.isNavbarDimmed = false;
    this.isHoveringNavbar = false;

    this.scrollOpacityHandler = () => {
      if (this.isMobileMenuOpen) return;

      const scrollY = window.scrollY;
      const hero = document.getElementById('home');
      const threshold = hero ? hero.offsetHeight - 80 : 300;

      if (scrollY > threshold) {
        if (!this.isNavbarDimmed) {
          this.isNavbarDimmed = true;
          navContainer.classList.add('nav-dimmed');
          if (!this.isHoveringNavbar) {
            navContainer.style.opacity = '0.35';
          }
        }
      } else {
        if (this.isNavbarDimmed) {
          this.isNavbarDimmed = false;
          navContainer.classList.remove('nav-dimmed');
          navContainer.style.opacity = '1';
        }
      }
    };

    navContainer.addEventListener('mouseenter', () => {
      this.isHoveringNavbar = true;
      navContainer.style.opacity = '1';
    });

    navContainer.addEventListener('mouseleave', () => {
      this.isHoveringNavbar = false;
      if (this.isNavbarDimmed && !this.isMobileMenuOpen) {
        navContainer.style.opacity = '0.35';
      }
    });

    window.addEventListener('scroll', this.scrollOpacityHandler, { passive: true });
    this.scrollOpacityHandler();
  }

  destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.scrollOpacityHandler) {
      window.removeEventListener('scroll', this.scrollOpacityHandler);
    }
  }
}

window.PillNav = PillNav;
