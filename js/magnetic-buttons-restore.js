/**
 * Magnetic Buttons Physics - GSAP-driven magnetic hover and elastic snap-back micro-interactions (Restored).
 */
class MagneticButtons {
  constructor() {
    this.buttons = [];
    this.init();
  }

  init() {
    // Graceful degradation: Check if touch device or if GSAP is available
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || !window.gsap) {
      return;
    }

    this.buttons = document.querySelectorAll('.button');
    this.buttons.forEach(btn => {
      btn.style.willChange = 'transform';
      
      const text = btn.querySelector('.text-block');
      if (text) {
        text.style.willChange = 'transform';
        text.style.display = 'inline-block'; // Ensure transforms apply cleanly
      }

      btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn, text));
      btn.addEventListener('mouseleave', () => this.handleMouseLeave(btn, text));
    });
  }

  handleMouseMove(e, btn, text) {
    const rect = btn.getBoundingClientRect();
    
    // Get absolute center of the button in viewport coordinates
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Calculate distance from cursor to button center
    const deltaX = e.clientX - btnCenterX;
    const deltaY = e.clientY - btnCenterY;

    // Magnetic pull strength: button moves 35% of the mouse offset
    window.gsap.to(btn, {
      x: deltaX * 0.35,
      y: deltaY * 0.35,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Inner text parallax: moves 15% of the mouse offset for 3D depth
    if (text) {
      window.gsap.to(text, {
        x: deltaX * 0.15,
        y: deltaY * 0.15,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }

  handleMouseLeave(btn, text) {
    // Elastic spring-back animation on leave
    window.gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)',
      overwrite: 'auto'
    });

    if (text) {
      window.gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto'
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MagneticButtons());
} else {
  new MagneticButtons();
}
